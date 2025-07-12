import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-action-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  template: `
    <h2 mat-dialog-title>{{ getActionTitle() }}</h2>
    
    <mat-dialog-content>
      <div class="application-info">
        <h4>Application: {{ data.application.applicantName }}</h4>
        <p>License Type: {{ data.application.licenseType }}</p>
      </div>

      <!-- Upload Field Results -->
      <div *ngIf="data.action === 'upload_field_results'" class="action-form">
        <div class="file-upload-section">
          <label class="file-upload-label">Upload Field Assessment Results:</label>
          <input type="file" (change)="onFileSelected($event)" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" class="file-input">
          <div class="file-info" *ngIf="selectedFile">
            📄 {{ selectedFile.name }}
          </div>
        </div>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Notes</mat-label>
          <textarea matInput [(ngModel)]="actionNotes" placeholder="Enter assessment notes..." rows="4"></textarea>
        </mat-form-field>
      </div>

      <!-- Calculate Rentals -->
      <div *ngIf="data.action === 'calculate_rentals'" class="action-form">
        <mat-form-field appearance="outline">
          <mat-label>Quantity</mat-label>
          <input matInput type="number" [(ngModel)]="rentalQuantity" (input)="calculateRental()" placeholder="Enter quantity">
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Rate (per unit per day)</mat-label>
          <input matInput type="number" [(ngModel)]="rentalRate" (input)="calculateRental()" placeholder="Enter daily rate">
        </mat-form-field>
        <div class="calculation-result" *ngIf="calculatedRental > 0">
          <strong>Annual Rental: MWK {{ calculatedRental.toLocaleString() }}</strong>
        </div>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Notes</mat-label>
          <textarea matInput [(ngModel)]="actionNotes" placeholder="Enter calculation notes..." rows="3"></textarea>
        </mat-form-field>
      </div>

      <!-- Schedule Approval -->
      <div *ngIf="data.action === 'schedule_approval'" class="action-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Scheduling Notes</mat-label>
          <textarea matInput [(ngModel)]="actionNotes" placeholder="Enter scheduling notes and recommendations..." rows="4"></textarea>
        </mat-form-field>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSubmit()">{{ getActionTitle() }}</button>
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
    .action-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .full-width {
      width: 100%;
    }
    .file-info {
      font-size: 12px;
      color: #28a745;
      font-weight: 500;
      margin-top: -10px;
    }
    .calculation-result {
      background: #e7f3ff;
      padding: 15px;
      border-radius: 6px;
      border-left: 4px solid #007bff;
      font-size: 16px;
      color: #0056b3;
    }
    .file-upload-section {
      margin-bottom: 16px;
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
  `]
})
export class ActionDialogComponent {
  actionNotes: string = '';
  selectedFile: File | null = null;
  rentalQuantity: number = 0;
  rentalRate: number = 0;
  calculatedRental: number = 0;

  constructor(
    public dialogRef: MatDialogRef<ActionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { action: string, application: any }
  ) {}

  getActionTitle(): string {
    switch (this.data.action) {
      case 'upload_field_results': return 'Upload Field Assessment Results';
      case 'calculate_rentals': return 'Calculate Annual Rentals';
      case 'schedule_approval': return 'Schedule for Approval';
      default: return 'Action';
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] || null;
  }

  calculateRental() {
    this.calculatedRental = this.rentalQuantity * this.rentalRate * 365;
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    const result = {
      action: this.data.action,
      notes: this.actionNotes,
      file: this.selectedFile,
      quantity: this.rentalQuantity,
      rate: this.rentalRate,
      calculatedRental: this.calculatedRental
    };
    this.dialogRef.close(result);
  }
}