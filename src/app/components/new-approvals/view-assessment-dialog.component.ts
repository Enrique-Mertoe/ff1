import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-view-assessment-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatDialogModule, MatButtonModule, 
    MatFormFieldModule, MatInputModule, MatTabsModule, MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>Assessment Review - {{ data.application.applicantName }}</h2>
    
    <mat-dialog-content>
      <div class="application-info">
        <h4>{{ data.application.licenseType }}</h4>
        <p>Application ID: {{ data.application.id.substring(0, 8) }}...</p>
        <p>Status: <span class="status-badge">{{ data.application.status }}</span></p>
      </div>

      <mat-tab-group>
        <!-- Assessment Files Tab -->
        <mat-tab label="Assessment Files">
          <div class="tab-content">
            <h4>Field Assessment Files</h4>
            <div class="files-section" *ngIf="data.assessment?.files?.length > 0; else noFiles">
              <div *ngFor="let file of data.assessment.files" class="file-item">
                <mat-icon>description</mat-icon>
                <span>{{ file.name }}</span>
                <button mat-icon-button (click)="downloadFile(file)">
                  <mat-icon>download</mat-icon>
                </button>
              </div>
            </div>
            <ng-template #noFiles>
              <p class="no-data">No assessment files uploaded</p>
            </ng-template>
            
            <div class="notes-section" *ngIf="data.assessment?.notes">
              <h4>Assessment Notes</h4>
              <div class="notes-content">{{ data.assessment.notes }}</div>
            </div>
          </div>
        </mat-tab>

        <!-- Rental Calculation Tab -->
        <mat-tab label="Rental Calculation">
          <div class="tab-content">
            <div class="calculation-display">
              <h4>Annual Rental Calculation</h4>
              <div class="calc-row">
                <span class="label">Quantity:</span>
                <span class="value">{{ data.assessment?.quantity || 'N/A' }}</span>
              </div>
              <div class="calc-row">
                <span class="label">Daily Rate:</span>
                <span class="value">MWK {{ (data.assessment?.rate || 0).toLocaleString() }}</span>
              </div>
              <div class="calc-row">
                <span class="label">Days per Year:</span>
                <span class="value">365</span>
              </div>
              <div class="calc-row total">
                <span class="label">Annual Rental:</span>
                <span class="value">MWK {{ (data.assessment?.calculatedRental || 0).toLocaleString() }}</span>
              </div>
            </div>
          </div>
        </mat-tab>

        <!-- Schedule Tab -->
        <mat-tab label="Schedule Recommendation">
          <div class="tab-content">
            <div class="schedule-info">
              <h4>Recommended Schedule</h4>
              <div class="schedule-row">
                <span class="label">Recommended Date:</span>
                <span class="value">{{ formatDate(data.assessment?.recommendedDate) }}</span>
              </div>
              <div class="schedule-notes" *ngIf="data.assessment?.scheduleNotes">
                <h4>Schedule Notes</h4>
                <div class="notes-content">{{ data.assessment.scheduleNotes }}</div>
              </div>
            </div>
          </div>
        </mat-tab>

        <!-- Manager Review Tab -->
        <mat-tab label="Manager Review">
          <div class="tab-content">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ data.userRole === 'drs' ? 'DRS Authorization Notes' : 'Manager Notes' }}</mat-label>
              <textarea matInput [(ngModel)]="managerNotes" 
                        placeholder="{{ data.userRole === 'drs' ? 'Add authorization notes...' : 'Add your review notes...' }}" rows="4"></textarea>
            </mat-form-field>
            
            <div class="file-upload-section">
              <label class="file-upload-label">Attach Additional Documents (Optional):</label>
              <input type="file" multiple (change)="onFilesSelected($event)" 
                     accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" class="file-input">
              <div class="selected-files" *ngIf="selectedFiles.length > 0">
                <div *ngFor="let file of selectedFiles" class="file-item">
                  📄 {{ file.name }}
                  <button type="button" (click)="removeFile(file)" class="remove-file">×</button>
                </div>
              </div>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="warn" (click)="onReject()">
        {{ data.userRole === 'drs' ? 'Reject Authorization' : 'Reject Schedule' }}
      </button>
      <button mat-raised-button color="primary" (click)="onApprove()">
        {{ data.userRole === 'drs' ? 'Authorize Schedule' : 'Approve Schedule' }}
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
      background: #ffc107;
      color: #212529;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }
    .tab-content {
      padding: 20px 0;
      min-height: 200px;
    }
    .files-section {
      margin-bottom: 20px;
    }
    .file-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px;
      background: #f8f9fa;
      border-radius: 4px;
      margin-bottom: 8px;
    }
    .file-item span {
      flex: 1;
    }
    .notes-section, .schedule-info {
      margin-top: 20px;
    }
    .notes-content {
      background: white;
      padding: 15px;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      line-height: 1.5;
    }
    .calculation-display {
      background: #e7f3ff;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #007bff;
    }
    .calc-row, .schedule-row {
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
      color: #0056b3;
      font-weight: 500;
    }
    .no-data {
      color: #666;
      font-style: italic;
      text-align: center;
      padding: 20px;
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
  `]
})
export class ViewAssessmentDialogComponent {
  managerNotes: string = '';
  selectedFiles: File[] = [];

  constructor(
    public dialogRef: MatDialogRef<ViewAssessmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { application: any, assessment: any, userRole?: string }
  ) {}

  onFilesSelected(event: any) {
    const files = Array.from(event.target.files) as File[];
    this.selectedFiles = [...this.selectedFiles, ...files];
  }

  removeFile(fileToRemove: File) {
    this.selectedFiles = this.selectedFiles.filter(file => file !== fileToRemove);
  }

  downloadFile(file: any) {
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  onReject() {
    const result = {
      action: 'reject',
      managerNotes: this.managerNotes,
      files: this.selectedFiles
    };
    this.dialogRef.close(result);
  }

  onApprove() {
    const result = {
      action: 'approve',
      managerNotes: this.managerNotes,
      files: this.selectedFiles
    };
    this.dialogRef.close(result);
  }
}