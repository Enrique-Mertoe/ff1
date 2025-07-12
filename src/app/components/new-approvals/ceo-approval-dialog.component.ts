import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-ceo-approval-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatDialogModule, MatButtonModule, 
    MatFormFieldModule, MatInputModule, MatTabsModule, MatIconModule, MatRadioModule
  ],
  template: `
    <h2 mat-dialog-title>CEO Approval - {{ data.application.applicantName }}</h2>
    
    <mat-dialog-content>
      <div class="application-info">
        <h4>{{ data.application.licenseType }}</h4>
        <p>Application ID: {{ data.application.id.substring(0, 8) }}...</p>
        <p>Status: <span class="status-badge">{{ data.application.status }}</span></p>
        <p *ngIf="data.application.recommendedScheduleDate">
          <strong>Recommended Schedule Date:</strong> {{ formatDate(data.application.recommendedScheduleDate) }}
        </p>
      </div>

      <mat-tab-group>
        <!-- Application Details Tab -->
        <mat-tab label="Application Form">
          <div class="tab-content">
            <div class="application-details">
              <h4>Applicant Information</h4>
              <div class="detail-row">
                <span class="label">Name:</span>
                <span class="value">{{ data.application.applicantName }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Email:</span>
                <span class="value">{{ data.application.applicantEmail }}</span>
              </div>
              <div class="detail-row">
                <span class="label">License Type:</span>
                <span class="value">{{ data.application.licenseType }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Application Date:</span>
                <span class="value">{{ formatDate(data.application.applicationDate) }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Application Fees:</span>
                <span class="value">MWK {{ (data.application.applicationFees || 0).toLocaleString() }}</span>
              </div>
            </div>
          </div>
        </mat-tab>

        <!-- Assessment Summary Tab -->
        <mat-tab label="Assessment Summary">
          <div class="tab-content">
            <div class="assessment-summary" *ngIf="data.assessment">
              <h4>Field Assessment Results</h4>
              <div class="detail-row">
                <span class="label">Assessment Notes:</span>
                <span class="value">{{ data.assessment.notes || 'No notes available' }}</span>
              </div>
              
              <h4>Annual Rental Calculation</h4>
              <div class="calc-display">
                <div class="calc-row">
                  <span class="label">Quantity:</span>
                  <span class="value">{{ data.assessment.quantity || 0 }}</span>
                </div>
                <div class="calc-row">
                  <span class="label">Daily Rate:</span>
                  <span class="value">MWK {{ (data.assessment.rate || 0).toLocaleString() }}</span>
                </div>
                <div class="calc-row total">
                  <span class="label">Annual Rental:</span>
                  <span class="value">MWK {{ (data.assessment.calculatedRental || 0).toLocaleString() }}</span>
                </div>
              </div>
            </div>
            <div *ngIf="!data.assessment" class="no-data">
              No assessment data available
            </div>
          </div>
        </mat-tab>

        <!-- CEO Decision Tab -->
        <mat-tab label="CEO Decision">
          <div class="tab-content">
            <div class="decision-section">
              <h4>📋 Board Decision</h4>
              
              <div class="decision-options">
                <mat-radio-group [(ngModel)]="decision" class="decision-radio-group">
                  <mat-radio-button value="approve" class="decision-option">
                    ✅ Approve Application
                  </mat-radio-button>
                  <mat-radio-button value="refer_back" class="decision-option">
                    ❌ Refer Back for Review
                  </mat-radio-button>
                </mat-radio-group>
              </div>
              
              <div *ngIf="decision === 'approve'" class="approval-section">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Board Minutes (Optional)</mat-label>
                  <textarea matInput [(ngModel)]="boardMinutes" 
                            placeholder="Enter board meeting minutes and approval notes..." rows="4"></textarea>
                </mat-form-field>
              </div>
              
              <div *ngIf="decision === 'refer_back'" class="referral-section">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Referral Comment (Required)</mat-label>
                  <textarea matInput [(ngModel)]="boardMinutes" 
                            placeholder="Enter reason for referring back..." rows="4" required></textarea>
                  <mat-hint>Please explain why this application is being referred back</mat-hint>
                </mat-form-field>
              </div>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="warn" (click)="onReferBack()" 
              *ngIf="decision === 'refer_back'" [disabled]="!boardMinutes?.trim()">
        Refer Back
      </button>
      <button mat-raised-button color="primary" (click)="onApprove()" 
              *ngIf="decision === 'approve'">
        Approve Application
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .application-info {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 6px;
      margin-bottom: 20px;
    }
    .application-info h4 {
      margin: 0 0 5px 0;
      color: #333;
    }
    .application-info p {
      margin: 5px 0;
      color: #666;
    }
    .status-badge {
      background: #28a745;
      color: white;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }
    .tab-content {
      padding: 20px 0;
      min-height: 300px;
    }
    .application-details, .assessment-summary {
      background: white;
      padding: 15px;
      border-radius: 6px;
      border: 1px solid #dee2e6;
    }
    .detail-row, .calc-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      padding: 5px 0;
    }
    .calc-row.total {
      border-top: 2px solid #007bff;
      margin-top: 15px;
      padding-top: 15px;
      font-weight: bold;
      font-size: 16px;
    }
    .label {
      font-weight: 500;
      color: #333;
    }
    .value {
      color: #666;
      font-weight: 500;
    }
    .calc-display {
      background: #e7f3ff;
      padding: 15px;
      border-radius: 6px;
      border-left: 4px solid #007bff;
      margin-top: 10px;
    }
    .no-data {
      color: #666;
      font-style: italic;
      text-align: center;
      padding: 40px;
    }
    .full-width {
      width: 100%;
    }
    .file-upload-section {
      margin-top: 20px;
    }
    .file-upload-label {
      display: block;
      font-weight: 500;
      color: #333;
      margin-bottom: 8px;
      font-size: 14px;
    }
    .file-input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }
    .selected-files {
      margin-top: 10px;
    }
    .file-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px;
      background: #f0f0f0;
      border-radius: 4px;
      margin-bottom: 5px;
      font-size: 12px;
    }
    .remove-file {
      background: #dc3545;
      color: white;
      border: none;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      cursor: pointer;
      font-size: 12px;
    }
    .decision-section {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .decision-section h4 {
      margin: 0 0 20px 0;
      color: #333;
    }
    .decision-radio-group {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    .decision-option {
      font-size: 16px;
      font-weight: 500;
    }
    .approval-section, .referral-section {
      margin-top: 20px;
      padding: 15px;
      border-radius: 6px;
    }
    .approval-section {
      background: #d4edda;
      border-left: 4px solid #28a745;
    }
    .referral-section {
      background: #f8d7da;
      border-left: 4px solid #dc3545;
    }
  `]
})
export class CEOApprovalDialogComponent {
  decision: string = '';
  ceoNotes: string = '';
  boardMinutes: string = '';
  selectedFiles: File[] = [];

  constructor(
    public dialogRef: MatDialogRef<CEOApprovalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { application: any, assessment: any }
  ) {}

  onFilesSelected(event: any) {
    const files = Array.from(event.target.files) as File[];
    this.selectedFiles = [...this.selectedFiles, ...files];
  }

  removeFile(fileToRemove: File) {
    this.selectedFiles = this.selectedFiles.filter(file => file !== fileToRemove);
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onReferBack() {
    const result = {
      action: 'refer_back',
      decision: this.decision,
      boardMinutes: this.boardMinutes,
      boardApprovalDate: null,
      files: this.selectedFiles
    };
    this.dialogRef.close(result);
  }

  onApprove() {
    const result = {
      action: 'approve',
      decision: this.decision,
      boardMinutes: this.boardMinutes,
      boardApprovalDate: new Date().toISOString(),
      files: this.selectedFiles
    };
    this.dialogRef.close(result);
  }
}