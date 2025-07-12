import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-assessment-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatDialogModule, MatButtonModule, 
    MatFormFieldModule, MatInputModule, MatDatepickerModule, 
    MatNativeDateModule, MatTabsModule
  ],
  providers: [provideNativeDateAdapter()],
  template: `
    <h2 mat-dialog-title>Complete Assessment - {{ data.application.applicantName }}</h2>
    
    <mat-dialog-content>
      <div class="application-info">
        <h4>{{ data.application.licenseType }}</h4>
        <p>Application ID: {{ data.application.id.substring(0, 8) }}...</p>
      </div>

      <mat-tab-group>
        <!-- Field Assessment Tab -->
        <mat-tab label="Field Assessment Results">
          <div class="tab-content">
            <div class="assessment-info">
              <h4>📋 Field Assessment Upload</h4>
              <p>Upload results from physical field inspection (water abstraction, borehole inspection, effluent discharge site visit, etc.)</p>
            </div>
            
            <div class="file-upload-section">
              <label class="file-upload-label">Upload Field Assessment Files (PDF, Photos, Scans):</label>
              <input type="file" multiple (change)="onFilesSelected($event)" 
                     accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" class="file-input">
              <div class="selected-files" *ngIf="selectedFiles.length > 0">
                <div *ngFor="let file of selectedFiles" class="file-item">
                  📄 {{ file.name }}
                  <button type="button" (click)="removeFile(file)" class="remove-file">×</button>
                </div>
              </div>
            </div>
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Field Visit Summary</mat-label>
              <textarea matInput [(ngModel)]="assessmentNotes" 
                        placeholder="Write a summary of what was observed during the field assessment..." rows="6"></textarea>
            </mat-form-field>
          </div>
        </mat-tab>

        <!-- Rental Calculation Tab -->
        <mat-tab label="Annual Rental Calculation">
          <div class="tab-content">
            <div class="rental-info">
              <h4>💰 Calculate Annual Rental Fee</h4>
              <p>Calculate rental fee based on water quantity and approved government rate</p>
              <p><strong>Formula:</strong> Annual Rental = Quantity × Rate × 365 days</p>
            </div>
            
            <div class="rental-form">
              <mat-form-field appearance="outline">
                <mat-label>Water Quantity (m³ per day)</mat-label>
                <input matInput type="number" [(ngModel)]="rentalQuantity" 
                       (input)="calculateRental()" placeholder="e.g., 1000">
                <mat-hint>Enter daily water quantity in cubic meters</mat-hint>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Rate (MWK per m³ per day)</mat-label>
                <input matInput type="number" [(ngModel)]="rentalRate" 
                       (input)="calculateRental()" placeholder="e.g., 50">
                <mat-hint>Government approved rate per cubic meter per day</mat-hint>
              </mat-form-field>
            </div>
            
            <div class="calculation-result" *ngIf="calculatedRental > 0">
              <h4>📊 Calculation Summary:</h4>
              <div class="calc-breakdown">
                <div class="calc-row">
                  <span>Daily Quantity:</span>
                  <span>{{ rentalQuantity?.toLocaleString() }} m³</span>
                </div>
                <div class="calc-row">
                  <span>Rate per m³:</span>
                  <span>MWK {{ rentalRate?.toLocaleString() }}</span>
                </div>
                <div class="calc-row">
                  <span>Days per Year:</span>
                  <span>365</span>
                </div>
                <div class="calc-row total">
                  <span><strong>Annual Rental:</strong></span>
                  <span><strong>MWK {{ calculatedRental?.toLocaleString() }}</strong></span>
                </div>
              </div>
            </div>
          </div>
        </mat-tab>

        <!-- Schedule Tab -->
        <mat-tab label="Schedule for Manager Review">
          <div class="tab-content">
            <div class="schedule-info">
              <h4>📅 Recommend for Licensing Manager</h4>
              <p>Propose a date for this application to be reviewed by the Licensing Manager</p>
            </div>
            
            <div class="application-summary">
              <h4>📋 Application Summary</h4>
              <div class="summary-grid">
                <div class="summary-item">
                  <span class="label">Applicant:</span>
                  <span class="value">{{ data.application.applicantName }}</span>
                </div>
                <div class="summary-item">
                  <span class="label">License Type:</span>
                  <span class="value">{{ data.application.licenseType }}</span>
                </div>
                <div class="summary-item" *ngIf="calculatedRental > 0">
                  <span class="label">Calculated Rental:</span>
                  <span class="value">MWK {{ calculatedRental?.toLocaleString() }}</span>
                </div>
              </div>
            </div>
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Recommended Review Date</mat-label>
              <input matInput [matDatepicker]="picker" [(ngModel)]="recommendedDate">
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
              <mat-hint>When should the Licensing Manager review this application?</mat-hint>
            </mat-form-field>
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Internal Recommendation Notes</mat-label>
              <textarea matInput [(ngModel)]="scheduleNotes" 
                        placeholder="Add any internal comments or recommendations for the Licensing Manager..." rows="4"></textarea>
            </mat-form-field>
          </div>
        </mat-tab>
      </mat-tab-group>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-stroked-button color="warn" (click)="onReferBack()" 
              style="margin-right: 10px;">Refer Back</button>
      <button mat-raised-button color="accent" (click)="onSaveDraft()" 
              style="margin-right: 10px;">Save Draft</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" 
              [disabled]="!isFormValid()">Submit for Manager Approval</button>
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
      margin: 0;
      color: #666;
    }
    .tab-content {
      padding: 20px 0;
      min-height: 300px;
    }
    .full-width {
      width: 100%;
    }
    .file-upload-section {
      margin-bottom: 20px;
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
    .rental-form {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 20px;
    }
    .assessment-info, .rental-info, .schedule-info {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 6px;
      margin-bottom: 20px;
      border-left: 4px solid #007bff;
    }
    .assessment-info h4, .rental-info h4, .schedule-info h4 {
      margin: 0 0 10px 0;
      color: #0056b3;
    }
    .assessment-info p, .rental-info p, .schedule-info p {
      margin: 5px 0;
      color: #666;
      font-size: 14px;
    }
    .calculation-result {
      background: #e7f3ff;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #28a745;
      margin-top: 20px;
    }
    .calculation-result h4 {
      margin: 0 0 15px 0;
      color: #155724;
    }
    .calc-breakdown {
      background: white;
      padding: 15px;
      border-radius: 6px;
      margin-top: 10px;
    }
    .calc-row {
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
      font-size: 16px;
    }
    .application-summary {
      background: #fff3cd;
      padding: 15px;
      border-radius: 6px;
      margin-bottom: 20px;
      border-left: 4px solid #ffc107;
    }
    .application-summary h4 {
      margin: 0 0 15px 0;
      color: #856404;
    }
    .summary-grid {
      display: grid;
      gap: 10px;
    }
    .summary-item {
      display: flex;
      justify-content: space-between;
      padding: 5px 0;
    }
    .summary-item .label {
      font-weight: 500;
      color: #666;
    }
    .summary-item .value {
      font-weight: 600;
      color: #333;
    }
  `]
})
export class AssessmentDialogComponent {
  selectedFiles: File[] = [];
  assessmentNotes: string = '';
  rentalQuantity: number = 0;
  rentalRate: number = 0;
  calculatedRental: number = 0;
  recommendedDate: Date | null = null;
  scheduleNotes: string = '';

  constructor(
    public dialogRef: MatDialogRef<AssessmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { application: any }
  ) {}

  onFilesSelected(event: any) {
    const files = Array.from(event.target.files) as File[];
    this.selectedFiles = [...this.selectedFiles, ...files];
  }

  removeFile(fileToRemove: File) {
    this.selectedFiles = this.selectedFiles.filter(file => file !== fileToRemove);
  }

  calculateRental() {
    this.calculatedRental = this.rentalQuantity * this.rentalRate * 365;
  }

  isFormValid(): boolean {
    return this.selectedFiles.length > 0 && 
           this.assessmentNotes.trim() !== '' &&
           this.calculatedRental > 0 &&
           this.recommendedDate !== null;
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    const result = {
      action: 'submit',
      files: this.selectedFiles,
      assessmentNotes: this.assessmentNotes,
      rentalQuantity: this.rentalQuantity,
      rentalRate: this.rentalRate,
      calculatedRental: this.calculatedRental,
      recommendedDate: this.recommendedDate,
      scheduleNotes: this.scheduleNotes
    };
    this.dialogRef.close(result);
  }

  onSaveDraft() {
    const result = {
      action: 'draft',
      files: this.selectedFiles,
      assessmentNotes: this.assessmentNotes,
      rentalQuantity: this.rentalQuantity,
      rentalRate: this.rentalRate,
      calculatedRental: this.calculatedRental,
      recommendedDate: this.recommendedDate,
      scheduleNotes: this.scheduleNotes
    };
    this.dialogRef.close(result);
  }

  onReferBack() {
    const result = {
      action: 'refer_back',
      files: this.selectedFiles,
      assessmentNotes: this.assessmentNotes,
      rentalQuantity: this.rentalQuantity,
      rentalRate: this.rentalRate,
      calculatedRental: this.calculatedRental,
      recommendedDate: this.recommendedDate,
      scheduleNotes: this.scheduleNotes
    };
    this.dialogRef.close(result);
  }
}