import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { COMMON_MODULES } from '../../custom-material/custom-material.module';
import { WorkflowService } from '../../shared/services/workflow.service';
import { AuthService } from '../../shared/services/auth.service';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-workflow-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ...COMMON_MODULES],
  templateUrl: './workflow-dashboard.component.html',
  styleUrl: './workflow-dashboard.component.scss'
})
export class WorkflowDashboardComponent implements OnInit {

  applications: any[] = [];
  pendingApplications: any[] = [];
  loading: boolean = true;
  currentUser: any = null;
  userRole: string = '';
  workflowInfo: any = {};
  selectedApplication: any = null;
  showActionDialog: boolean = false;
  actionType: string = '';
  actionNotes: string = '';
  selectedFiles: FileList | null = null;
  selectedFilesArray: File[] = [];
  rentalCalculation: any = {
    quantity: 0,
    rate: 0,
    annualRental: 0
  };

  constructor(
    private workflowService: WorkflowService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  async ngOnInit() {
    try {
      this.currentUser = await this.authService.getCurrentUser();
      this.userRole = this.currentUser?.sysUserGroup?.name?.toLowerCase() || '';
      this.workflowInfo = this.workflowService.getWorkflowStepInfo(this.userRole);
      
      await this.loadApplications();
    } catch (error) {
      console.error('Error initializing workflow dashboard:', error);
      this.notificationService.error('Error', 'Failed to load workflow dashboard');
    } finally {
      this.loading = false;
    }
  }

  async loadApplications() {
    try {
      this.applications = await this.workflowService.getApplicationsForRole();
      this.pendingApplications = await this.workflowService.getPendingApplications();
      
      console.log('Loaded applications:', this.applications.length);
      console.log('Pending applications:', this.pendingApplications.length);
    } catch (error) {
      console.error('Error loading applications:', error);
      throw error;
    }
  }

  getAvailableActions(application: any): string[] {
    return this.workflowService.getAvailableActions(application);
  }

  openActionDialog(application: any, action: string) {
    this.selectedApplication = application;
    this.actionType = action;
    this.actionNotes = '';
    this.selectedFiles = null;
    this.showActionDialog = true;
  }

  closeActionDialog() {
    this.showActionDialog = false;
    this.selectedApplication = null;
    this.actionType = '';
    this.actionNotes = '';
    this.selectedFiles = null;
    this.selectedFilesArray = [];
  }

  onFilesSelected(event: any) {
    this.selectedFiles = event.target.files;
    this.selectedFilesArray = Array.from(this.selectedFiles || []);
  }

  async executeAction() {
    if (!this.selectedApplication || !this.actionType) return;

    try {
      const actionData: any = {
        notes: this.actionNotes,
        processedBy: this.currentUser?.id,
        processedAt: new Date().toISOString()
      };

      // Handle specific actions
      if (this.actionType === 'upload_field_results' && this.selectedFiles) {
        await this.workflowService.uploadFieldResults(
          this.selectedApplication.id, 
          this.selectedFiles, 
          this.actionNotes
        );
      } else if (this.actionType === 'calculate_rentals') {
        actionData.rentalCalculation = this.rentalCalculation;
      } else {
        // Standard workflow action
        await this.workflowService.processApplication(
          this.selectedApplication.id,
          this.actionType,
          actionData
        );
      }

      this.notificationService.success('Success', `Action ${this.actionType} completed successfully`);
      this.closeActionDialog();
      
      // Reload applications
      await this.loadApplications();
      
    } catch (error) {
      console.error('Error executing action:', error);
      this.notificationService.error('Error', 'Failed to execute action');
    }
  }

  getStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'submitted': return '#28a745';
      case 'under_review': 
      case 'pending_review': return '#ffc107';
      case 'approved': return '#007bff';
      case 'rejected': return '#dc3545';
      case 'pending_manager_approval':
      case 'pending_drs_approval':
      case 'pending_ceo_approval': return '#17a2b8';
      case 'field_assessment_required':
      case 'field_assessment_complete': return '#6f42c1';
      default: return '#6c757d';
    }
  }

  getStatusText(status: string): string {
    return status?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown';
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatCurrency(amount: number): string {
    if (!amount) return 'N/A';
    return `MWK ${new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)}`;
  }

  calculateRental() {
    this.rentalCalculation.annualRental = 
      this.rentalCalculation.quantity * this.rentalCalculation.rate * 365;
  }

  getActionIcon(action: string): string {
    switch (action) {
      case 'approve': return '✅';
      case 'reject': return '❌';
      case 'refer_back': return '↩️';
      case 'request_field_assessment': return '🔍';
      case 'upload_field_results': return '📤';
      case 'calculate_rentals': return '🧮';
      case 'schedule_for_approval': return '📅';
      case 'generate_invoice': return '🧾';
      default: return '⚡';
    }
  }

  getActionLabel(action: string): string {
    return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
}