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
  selector: 'app-drs-authorization-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatDialogModule, MatButtonModule, 
    MatFormFieldModule, MatInputModule, MatTabsModule, MatIconModule, MatRadioModule
  ],
  template: `
    <h2 mat-dialog-title>DRS Authorization - {{ data.application.applicantName }}</h2>
    
    <mat-dialog-content>
      <div class="application-info">
        <h4>{{ data.application.licenseType }}</h4>
        <p>Application ID: {{ data.application.id.substring(0, 8) }}...</p>
        <p>Status: <span class="status-badge">{{ data.application.status }}</span></p>
      </div>

      <mat-tab-group>
        <!-- Application Summary Tab -->
        <mat-tab label="Application Summary">
          <div class="tab-content">
            <div class="summary-section">
              <h4>📄 Application Details</h4>
              <div class="detail-grid">
                <div class="detail-row">
                  <span class="label">Applicant:</span>
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
          </div>
        </mat-tab>

        <!-- Assessment & Rental View Tab -->
        <mat-tab label="Assessment & Rental">
          <div class="tab-content">
            <div class="assessment-view" *ngIf="data.assessment">
              <h4>📑 Field Assessment Results</h4>
              <div class="readonly-section">
                <div class="detail-row">
                  <span class="label">Assessment Notes:</span>
                  <span class="value">{{ data.assessment.notes || 'No notes available' }}</span>
                </div>
                <div class="detail-row" *ngIf="data.assessment.files?.length > 0">
                  <span class="label">Assessment Files:</span>
                  <span class="value">{{ data.assessment.files.length }} file(s) uploaded</span>
                </div>
              </div>
              
              <h4>💰 Annual Rental Calculation</h4>
              <div class="calc-display">
                <div class="calc-row">
                  <span class="label">Daily Quantity:</span>
                  <span class="value">{{ data.assessment.quantity || 0 }} m³</span>
                </div>
                <div class="calc-row">
                  <span class="label">Rate per m³:</span>
                  <span class="value">MWK {{ (data.assessment.rate || 0).toLocaleString() }}</span>
                </div>
                <div class="calc-row">
                  <span class="label">Days per Year:</span>
                  <span class="value">365</span>
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

        <!-- Schedule Details Tab -->
        <mat-tab label="Schedule Details">
          <div class="tab-content">
            <div class="schedule-view">
              <h4>🗓 Proposed Schedule</h4>
              <div class="readonly-section">
                <div class="detail-row">
                  <span class="label">Recommended Date:</span>
                  <span class="value">{{ formatDate(data.assessment?.recommendedDate) }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Schedule Notes:</span>
                  <span class="value">{{ data.assessment?.scheduleNotes || 'No schedule notes' }}</span>
                </div>
              </div>
              
              <h4>📝 Licensing Manager Recommendations</h4>
              <div class="readonly-section">
                <div class="detail-row">
                  <span class="label">Manager Status:</span>
                  <span class="value">Approved for DRS Review</span>
                </div>
                <div class="detail-row">
                  <span class="label">Manager Notes:</span>
                  <span class="value">Assessment and schedule approved by Licensing Manager</span>
                </div>
              </div>
            </div>
          </div>
        </mat-tab>

        <!-- DRS Decision Tab -->
        <mat-tab label="DRS Decision">
          <div class="tab-content">
            <div class="decision-section">
              <h4>🔍 DRS Authorization</h4>
              <p>Review the application, assessment, and schedule. Authorize for CEO/Board approval or refer back for corrections.</p>
              
              <div class="decision-options">
                <mat-radio-group [(ngModel)]="decision" class="decision-radio-group">
                  <mat-radio-button value="approve" class="decision-option">
                    ✅ Authorize for CEO/Board Approval
                  </mat-radio-button>
                  <mat-radio-button value="refer_back" class="decision-option">
                    ↩️ Refer Back for Corrections
                  </mat-radio-button>
                </mat-radio-group>
              </div>
              
              <div *ngIf="decision === 'refer_back'" class="referral-section">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Referral Reason (Required)</mat-label>
                  <textarea matInput [(ngModel)]="drsNotes" 
                            placeholder="Enter reason for referring back..." rows="4" required></textarea>
                  <mat-hint>Please explain why this application is being referred back</mat-hint>
                </mat-form-field>
              </div>
              
              <div *ngIf="decision === 'approve'" class="approval-section">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>DRS Authorization Notes (Optional)</mat-label>
                  <textarea matInput [(ngModel)]="drsNotes" 
                            placeholder="Add any additional notes for CEO review..." rows="3"></textarea>
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
              *ngIf="decision === 'refer_back'" [disabled]="!drsNotes?.trim()">
        Refer Back
      </button>
      <button mat-raised-button color="primary" (click)="onAuthorize()" 
              *ngIf="decision === 'approve'">
        Authorize for CEO
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
    .status-badge {
      background: #ffc107;
      color: #212529;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }
    .tab-content {
      padding: 20px 0;
      min-height: 300px;
    }
    .summary-section, .assessment-view, .schedule-view {
      background: white;
      padding: 15px;
      border-radius: 6px;
      border: 1px solid #dee2e6;
      margin-bottom: 20px;
    }
    .detail-grid, .readonly-section {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .detail-row, .calc-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    .calc-row.total {
      border-top: 2px solid #28a745;
      border-bottom: none;
      margin-top: 10px;
      padding-top: 15px;
      font-weight: bold;
      font-size: 16px;
    }
    .label {
      font-weight: 500;
      color: #333;
      min-width: 150px;
    }
    .value {
      color: #666;
      font-weight: 500;
      flex: 1;
      text-align: right;
    }
    .calc-display {
      background: #e7f3ff;
      padding: 15px;
      border-radius: 6px;
      border-left: 4px solid #007bff;
      margin-top: 15px;
    }
    .no-data {
      color: #666;
      font-style: italic;
      text-align: center;
      padding: 40px;
    }
    .decision-section {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
    }
    .decision-radio-group {
      display: flex;
      flex-direction: column;
      gap: 15px;
      margin: 20px 0;
    }
    .decision-option {
      font-size: 16px;
      font-weight: 500;
    }
    .approval-section {
      background: #d4edda;
      padding: 15px;
      border-radius: 6px;
      border-left: 4px solid #28a745;
      margin-top: 20px;
    }
    .referral-section {
      background: #f8d7da;
      padding: 15px;
      border-radius: 6px;
      border-left: 4px solid #dc3545;
      margin-top: 20px;
    }
    .full-width {
      width: 100%;
    }
  `]
})
export class DRSAuthorizationDialogComponent {
  decision: string = '';
  drsNotes: string = '';

  constructor(
    public dialogRef: MatDialogRef<DRSAuthorizationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { application: any, assessment: any }
  ) {}

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
      drsNotes: this.drsNotes
    };
    this.dialogRef.close(result);
  }

  onAuthorize() {
    const result = {
      action: 'approve',
      decision: this.decision,
      drsNotes: this.drsNotes
    };
    this.dialogRef.close(result);
  }
}