import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../shared/services/api.service';
import { NotificationService } from '../../shared/services/notification.service';
import { AssessmentDialogComponent } from './assessment-dialog.component';
import { ViewAssessmentDialogComponent } from './view-assessment-dialog.component';
import { CEOApprovalDialogComponent } from './ceo-approval-dialog.component';
import { DRSAuthorizationDialogComponent } from './drs-authorization-dialog.component';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-new-approvals',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './new-approvals.component.html',
  styleUrls: ['./new-approvals.component.scss']
})
export class NewApprovalsComponent implements OnInit {
  applications: any[] = [];
  loading: boolean = false;
  selectedApp: any = null;
  currentUserRole: string = '';

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    await this.loadCurrentUserRole();
    this.loadApprovedApplications();
  }

  async loadCurrentUserRole() {
    try {
      const user = this.authService.getCurrentUser();
      this.currentUserRole = user?.sysUserGroup?.name?.toLowerCase() || '';
      console.log('=== USER ROLE LOADED ===');
      console.log('Current user:', user);
      console.log('User role:', this.currentUserRole);
    } catch (error) {
      console.error('Error loading user role:', error);
    }
  }

  async loadApprovedApplications() {
    this.loading = true;
    try {
      let status = 'REVIEW_APPROVED';
      
      console.log('=== LOADING APPLICATIONS ===');
      console.log('Current user role:', this.currentUserRole);
      
      // License managers see PENDING_SCHEDULE applications
      if (this.currentUserRole === 'licensing_manager' || this.currentUserRole === 'license_manager') {
        status = 'PENDING_SCHEDULE';
      }
      // DRS sees PENDING_SCHEDULE_AUTHORIZATION applications
      else if (this.currentUserRole === 'drs') {
        status = 'PENDING_SCHEDULE_AUTHORIZATION';
      }
      // CEO sees AUTHORIZED_SCHEDULE applications
      else if (this.currentUserRole === 'ceo') {
        status = 'AUTHORIZED_SCHEDULE';
      }
      
      console.log('Fetching applications with status:', status);
      this.applications = await this.apiService.get<any[]>(`/license-applications/by-status/${status}`);
      console.log('Applications loaded:', this.applications);
    } catch (error) {
      console.error('Error loading applications:', error);
      this.notificationService.error('Error', 'Failed to load applications');
    } finally {
      this.loading = false;
    }
  }

  setSelectedApp(app: any) {
    this.selectedApp = app;
    console.log('=== SELECTED APP ===');
    console.log('Selected application:', app);
    console.log('Current user role:', this.currentUserRole);
    console.log('Should show DRS action?', this.currentUserRole === 'drs');
  }

  openAssessmentDialog() {
    const dialogRef = this.dialog.open(AssessmentDialogComponent, {
      width: '800px',
      maxHeight: '90vh',
      data: { application: this.selectedApp }
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.submitCompleteAssessment(result);
      }
    });
  }

  async submitCompleteAssessment(result: any) {
    try {
      const formData = new FormData();
      
      // Add files
      result.files.forEach((file: File) => {
        formData.append('assessmentFiles', file);
      });
      
      // Add assessment data
      formData.append('action', result.action || 'submit');
      formData.append('assessmentNotes', result.assessmentNotes);
      formData.append('rentalQuantity', result.rentalQuantity.toString());
      formData.append('rentalRate', result.rentalRate.toString());
      formData.append('calculatedRental', result.calculatedRental.toString());
      formData.append('recommendedDate', result.recommendedDate.toISOString());
      formData.append('scheduleNotes', result.scheduleNotes);
      
      await this.apiService.postFormData(`/workflow/complete-assessment/${this.selectedApp.id}`, formData);
      
      const messages = {
        'submit': 'Assessment submitted for manager review',
        'draft': 'Assessment saved as draft',
        'refer_back': 'Application referred back'
      };
      const message = messages[result.action] || 'Assessment completed successfully';
      this.notificationService.success('Success', message);
      this.loadApprovedApplications();
    } catch (error: any) {
      console.error('Assessment submission error:', error);
      const errorMessage = error?.error?.error || error?.message || 'Failed to complete assessment';
      this.notificationService.error('Error', errorMessage);
    }
  }

  async viewAssessment() {
    try {
      console.log('=== FETCHING ASSESSMENT DATA ===');
      console.log('Application ID:', this.selectedApp.id);
      
      // Fetch real assessment data from backend
      const assessmentData = await this.apiService.get(`/workflow/assessment/${this.selectedApp.id}`);
      console.log('Assessment data received:', assessmentData);
      
      const dialogRef = this.dialog.open(ViewAssessmentDialogComponent, {
        width: '900px',
        maxHeight: '90vh',
        data: { application: this.selectedApp, assessment: assessmentData }
      });

      dialogRef.afterClosed().subscribe(async (result) => {
        if (result) {
          await this.handleManagerReview(result);
        }
      });
    } catch (error) {
      console.error('Error fetching assessment data:', error);
      this.notificationService.error('Error', 'Failed to load assessment data');
    }
  }

  async handleManagerReview(result: any) {
    try {
      const formData = new FormData();
      formData.append('action', result.action);
      formData.append('managerNotes', result.managerNotes);
      
      result.files.forEach((file: File) => {
        formData.append('managerFiles', file);
      });
      
      await this.apiService.postFormData(`/workflow/manager-review/${this.selectedApp.id}`, formData);
      
      const message = result.action === 'approve' ? 'Schedule approved successfully' : 'Schedule rejected';
      this.notificationService.success('Success', message);
      this.loadApprovedApplications();
    } catch (error) {
      this.notificationService.error('Error', 'Failed to process review');
    }
  }

  async viewScheduleForAuthorization() {
    try {
      console.log('=== DRS VIEWING SCHEDULE FOR AUTHORIZATION ===');
      console.log('Application ID:', this.selectedApp.id);
      
      // Fetch real assessment data from backend
      const assessmentData = await this.apiService.get(`/workflow/assessment/${this.selectedApp.id}`);
      console.log('DRS - Assessment data received:', assessmentData);
      
      const dialogRef = this.dialog.open(DRSAuthorizationDialogComponent, {
        width: '1000px',
        maxHeight: '90vh',
        data: { 
          application: this.selectedApp, 
          assessment: assessmentData
        }
      });

      dialogRef.afterClosed().subscribe(async (result) => {
        if (result) {
          await this.handleDRSAuthorization(result);
        }
      });
    } catch (error) {
      console.error('Error fetching assessment data for DRS:', error);
      this.notificationService.error('Error', 'Failed to load assessment data');
    }
  }

  async handleDRSAuthorization(result: any) {
    try {
      const formData = new FormData();
      formData.append('action', result.action);
      formData.append('drsNotes', result.drsNotes || '');
      
      await this.apiService.postFormData(`/workflow/drs-authorization/${this.selectedApp.id}`, formData);
      
      const message = result.action === 'approve' ? 'Application authorized for CEO approval' : 'Application referred back';
      this.notificationService.success('Success', message);
      this.loadApprovedApplications();
    } catch (error) {
      this.notificationService.error('Error', 'Failed to process DRS authorization');
    }
  }

  async viewForCEOApproval() {
    try {
      console.log('=== CEO VIEWING FOR APPROVAL ===');
      console.log('Application ID:', this.selectedApp.id);
      
      // Fetch assessment data for CEO review
      const assessmentData = await this.apiService.get(`/workflow/assessment/${this.selectedApp.id}`);
      console.log('CEO - Assessment data received:', assessmentData);
      
      const dialogRef = this.dialog.open(CEOApprovalDialogComponent, {
        width: '1000px',
        maxHeight: '90vh',
        data: { 
          application: this.selectedApp, 
          assessment: assessmentData
        }
      });

      dialogRef.afterClosed().subscribe(async (result) => {
        if (result) {
          await this.handleCEODecision(result);
        }
      });
    } catch (error) {
      console.error('Error loading data for CEO approval:', error);
      this.notificationService.error('Error', 'Failed to load application data');
    }
  }

  async handleCEODecision(result: any) {
    try {
      const formData = new FormData();
      formData.append('action', result.action);
      formData.append('boardMinutes', result.boardMinutes || '');
      formData.append('boardApprovalDate', result.boardApprovalDate || '');
      
      if (result.boardMinutes) {
        formData.append('boardMinutes', result.boardMinutes);
      }
      
      result.files.forEach((file: File) => {
        formData.append('ceoFiles', file);
      });
      
      await this.apiService.postFormData(`/workflow/ceo-decision/${this.selectedApp.id}`, formData);
      
      const message = result.action === 'approve' ? 'Application approved by CEO' : 'Application referred back by CEO';
      this.notificationService.success('Success', message);
      this.loadApprovedApplications();
    } catch (error) {
      this.notificationService.error('Error', 'Failed to process CEO decision');
    }
  }

  private async uploadFieldResults(result: any) {
    const formData = new FormData();
    formData.append('files', result.file);
    formData.append('notes', result.notes);
    return await this.apiService.postFormData(`/workflow/upload-field-results/${this.selectedApp.id}`, formData);
  }

  private async calculateAnnualRentals(result: any) {
    return await this.apiService.post(`/workflow/calculate-rentals/${this.selectedApp.id}`, {
      quantity: result.quantity,
      rate: result.rate,
      notes: result.notes
    });
  }

  private async scheduleForApproval(result: any) {
    return await this.apiService.post(`/workflow/schedule-approval/${this.selectedApp.id}`, {
      notes: result.notes,
      scheduledDate: new Date().toISOString()
    });
  }



  formatDate(dateString: string): string {
    return dateString ? new Date(dateString).toLocaleDateString() : 'N/A';
  }

  formatCurrency(amount: number): string {
    return amount ? `MWK ${amount.toLocaleString()}` : 'N/A';
  }
}