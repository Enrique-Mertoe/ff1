import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { COMMON_MODULES } from '../../custom-material/custom-material.module';
import { SurfaceWaterPermitService } from '../../shared/services/surface-water-permit.service';
import { AuthService } from '../../shared/services/auth.service';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-application-workflow',
  standalone: true,
  imports: [CommonModule, ...COMMON_MODULES],
  template: `
    <div class="workflow-container">
      <h2>Application Workflow Management</h2>
      
      <div class="filters">
        <mat-form-field>
          <mat-label>Filter by Status</mat-label>
          <mat-select [(value)]="selectedStatus" (selectionChange)="filterApplications()">
            <mat-option value="">All</mat-option>
            <mat-option value="SUBMITTED">Submitted</mat-option>
            <mat-option value="UNDER_REVIEW">Under Review</mat-option>
            <mat-option value="PENDING_APPROVAL">Pending Approval</mat-option>
            <mat-option value="APPROVED">Approved</mat-option>
            <mat-option value="REJECTED">Rejected</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div class="applications-grid" *ngIf="!loading">
        <mat-card *ngFor="let application of filteredApplications" class="application-card">
          <mat-card-header>
            <mat-card-title>{{application.licenseType}}</mat-card-title>
            <mat-card-subtitle>Application ID: {{application.id}}</mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <p><strong>Applicant:</strong> {{application.applicantName}}</p>
            <p><strong>Status:</strong> 
              <span [style.color]="getStatusColor(application.status)">
                {{getStatusText(application.status)}}
              </span>
            </p>
            <p><strong>Current Step:</strong> {{application.currentStep}}</p>
            <p><strong>Submitted:</strong> {{formatDate(application.applicationDate)}}</p>
          </mat-card-content>
          
          <mat-card-actions>
            <button mat-button (click)="viewApplication(application)">View Details</button>
            <button mat-raised-button color="primary" 
                    (click)="approveApplication(application)"
                    *ngIf="canApprove(application)">
              Approve
            </button>
            <button mat-raised-button color="warn" 
                    (click)="rejectApplication(application)"
                    *ngIf="canReject(application)">
              Reject
            </button>
            <button mat-button color="accent" 
                    (click)="referBackApplication(application)"
                    *ngIf="canReferBack(application)">
              Refer Back
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <div *ngIf="loading" class="loading">
        <mat-spinner></mat-spinner>
        <p>Loading applications...</p>
      </div>

      <!-- Application Details Dialog -->
      <div *ngIf="selectedApplication" class="dialog-overlay" (click)="closeDialog()">
        <div class="dialog-content" (click)="$event.stopPropagation()">
          <h3>Application Details</h3>
          <div class="application-details">
            <p><strong>ID:</strong> {{selectedApplication.id}}</p>
            <p><strong>Type:</strong> {{selectedApplication.licenseType}}</p>
            <p><strong>Applicant:</strong> {{selectedApplication.applicantName}}</p>
            <p><strong>Status:</strong> {{selectedApplication.status}}</p>
            <p><strong>Current Step:</strong> {{selectedApplication.currentStep}}</p>
            <p><strong>Submitted:</strong> {{formatDate(selectedApplication.applicationDate)}}</p>
          </div>
          <div class="dialog-actions">
            <button mat-button (click)="closeDialog()">Close</button>
          </div>
        </div>
      </div>

      <!-- Action Dialog -->
      <div *ngIf="showActionDialog" class="dialog-overlay" (click)="closeActionDialog()">
        <div class="dialog-content" (click)="$event.stopPropagation()">
          <h3>{{actionDialogTitle}}</h3>
          <mat-form-field class="full-width">
            <mat-label>Comments</mat-label>
            <textarea matInput [(ngModel)]="actionComments" rows="4"></textarea>
          </mat-form-field>
          <div class="dialog-actions">
            <button mat-button (click)="closeActionDialog()">Cancel</button>
            <button mat-raised-button [color]="actionButtonColor" (click)="confirmAction()">
              {{actionDialogTitle}}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .workflow-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .filters {
      margin-bottom: 20px;
    }

    .applications-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 20px;
    }

    .application-card {
      margin-bottom: 16px;
    }

    .loading {
      text-align: center;
      padding: 40px;
    }

    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .dialog-content {
      background: white;
      padding: 24px;
      border-radius: 8px;
      max-width: 500px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
    }

    .application-details p {
      margin: 8px 0;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 20px;
    }

    .full-width {
      width: 100%;
    }
  `]
})
export class ApplicationWorkflowComponent implements OnInit {
  applications: any[] = [];
  filteredApplications: any[] = [];
  loading: boolean = true;
  selectedStatus: string = '';
  selectedApplication: any = null;
  showActionDialog: boolean = false;
  actionDialogTitle: string = '';
  actionButtonColor: string = 'primary';
  actionComments: string = '';
  currentAction: string = '';
  currentUser: any = null;

  constructor(
    private surfaceWaterPermitService: SurfaceWaterPermitService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  async ngOnInit() {
    try {
      this.currentUser = await this.authService.getCurrentUser();
      await this.loadApplications();
    } catch (error) {
      console.error('Error loading workflow:', error);
      this.notificationService.error('Error', 'Failed to load applications');
    } finally {
      this.loading = false;
    }
  }

  async loadApplications() {
    try {
      this.applications = await this.surfaceWaterPermitService.getAllApplications();
      this.filteredApplications = [...this.applications];
      console.log('Loaded applications for workflow:', this.applications);
    } catch (error) {
      console.error('Error loading applications:', error);
      throw error;
    }
  }

  filterApplications() {
    if (this.selectedStatus) {
      this.filteredApplications = this.applications.filter(
        app => app.status === this.selectedStatus
      );
    } else {
      this.filteredApplications = [...this.applications];
    }
  }

  viewApplication(application: any) {
    this.selectedApplication = application;
  }

  closeDialog() {
    this.selectedApplication = null;
  }

  canApprove(application: any): boolean {
    return ['SUBMITTED', 'UNDER_REVIEW', 'PENDING_APPROVAL'].includes(application.status);
  }

  canReject(application: any): boolean {
    return ['SUBMITTED', 'UNDER_REVIEW', 'PENDING_APPROVAL'].includes(application.status);
  }

  canReferBack(application: any): boolean {
    return ['UNDER_REVIEW', 'PENDING_APPROVAL'].includes(application.status);
  }

  approveApplication(application: any) {
    this.selectedApplication = application;
    this.currentAction = 'approve';
    this.actionDialogTitle = 'Approve Application';
    this.actionButtonColor = 'primary';
    this.actionComments = '';
    this.showActionDialog = true;
  }

  rejectApplication(application: any) {
    this.selectedApplication = application;
    this.currentAction = 'reject';
    this.actionDialogTitle = 'Reject Application';
    this.actionButtonColor = 'warn';
    this.actionComments = '';
    this.showActionDialog = true;
  }

  referBackApplication(application: any) {
    this.selectedApplication = application;
    this.currentAction = 'refer-back';
    this.actionDialogTitle = 'Refer Back Application';
    this.actionButtonColor = 'accent';
    this.actionComments = '';
    this.showActionDialog = true;
  }

  closeActionDialog() {
    this.showActionDialog = false;
    this.selectedApplication = null;
    this.actionComments = '';
  }

  async confirmAction() {
    if (!this.selectedApplication) return;

    try {
      const actionData = {
        comments: this.actionComments,
        approver: this.currentUser.id,
        actionDate: new Date().toISOString()
      };

      let result;
      switch (this.currentAction) {
        case 'approve':
          result = await this.surfaceWaterPermitService.approveApplication(
            this.selectedApplication.id, 
            actionData
          );
          this.notificationService.success('Success', 'Application approved successfully');
          break;
        case 'reject':
          result = await this.surfaceWaterPermitService.rejectApplication(
            this.selectedApplication.id, 
            actionData
          );
          this.notificationService.success('Success', 'Application rejected');
          break;
        case 'refer-back':
          result = await this.surfaceWaterPermitService.referBackApplication(
            this.selectedApplication.id, 
            actionData
          );
          this.notificationService.success('Success', 'Application referred back');
          break;
      }

      console.log('Action result:', result);
      
      // Reload applications
      await this.loadApplications();
      this.filterApplications();
      
      this.closeActionDialog();
      
    } catch (error) {
      console.error('Error performing action:', error);
      this.notificationService.error('Error', 'Failed to perform action');
    }
  }

  getStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'submitted': return '#28a745';
      case 'under_review': return '#ffc107';
      case 'pending_approval': return '#17a2b8';
      case 'approved': return '#007bff';
      case 'rejected': return '#dc3545';
      default: return '#6c757d';
    }
  }

  getStatusText(status: string): string {
    switch (status?.toLowerCase()) {
      case 'submitted': return 'Submitted';
      case 'under_review': return 'Under Review';
      case 'pending_approval': return 'Pending Approval';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      default: return status || 'Unknown';
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}