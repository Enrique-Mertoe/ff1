import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { COMMON_MODULES } from '../../custom-material/custom-material.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CoreLicenseApplicationService } from '../../shared/services/core-license-application.service';
import { SurfaceWaterPermitService } from '../../shared/services/surface-water-permit.service';
import { AuthService } from '../../shared/services/auth.service';
import { NotificationService } from '../../shared/services/notification.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-my-applications',
  standalone: true,
  imports: [CommonModule, FormsModule, ...COMMON_MODULES, MatMenuModule, MatIconModule, MatButtonModule],
  templateUrl: './my-applications.component.html',
  styleUrl: './my-applications.component.scss'
})
export class MyApplicationsComponent implements OnInit {

  // No need for ViewChild references since we're not collecting payment details

  applications: any[] = [];
  loading: boolean = true;
  selectedApplication: any = null;
  showPaymentDialog: boolean = false;
  showDetailsDialog: boolean = false;
  showInvoicePreview: boolean = false;
  showReceiptUpload: boolean = false;
  currentUser: any = null;
  selectedApp: any = null;
  invoicePreviewUrl: string = '';
  selectedFile: File | null = null;
  paymentMethods: any[] = [
    { id: 'mobile_money', name: 'Mobile Money (Airtel/TNM)', icon: '📱' },
    { id: 'bank_transfer', name: 'Bank Transfer', icon: '🏦' },
    { id: 'cash_deposit', name: 'Cash Deposit', icon: '💰' },
    { id: 'cheque', name: 'Cheque Payment', icon: '📄' },
    { id: 'other', name: 'Other Payment Method', icon: '💳' }
  ];
  selectedPaymentMethod: string = '';
  uploadNotes: string = '';

  constructor(
    private applicationService: CoreLicenseApplicationService,
    private surfaceWaterPermitService: SurfaceWaterPermitService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  async ngOnInit() {
    try {
      this.currentUser = await this.authService.getCurrentUser();
      await this.loadApplications();
    } catch (error) {
      console.error('Error loading applications:', error);
      this.notificationService.error('Error', 'Failed to load applications');
    } finally {
      this.loading = false;
    }
  }

  async loadApplications() {
    try {
      // Get applications from the main endpoint - it already includes payment status
      this.applications = await this.applicationService.getMyApplications();
      
      // Add current user email if not present
      this.applications = this.applications.map((app: any) => ({
        ...app,
        applicantEmail: this.currentUser?.emailAddress || app.applicantEmail
      }));
      
      console.log('Applications loaded:', this.applications);
      
    } catch (error) {
      console.error('Error loading applications:', error);
      throw error;
    }
  }

  async getPaymentStatus(applicationId: string) {
    try {
      // Use generic payment status endpoint only
      const response = await fetch(`${environment.apiURL}/license-applications/${applicationId}/payment-status`);
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Error getting payment status:', error);
      return null;
    }
  }

  getStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'submitted': return '#28a745';
      case 'under_review': return '#ffc107';
      case 'approved': return '#007bff';
      case 'rejected': return '#dc3545';
      case 'paid': return '#28a745';
      case 'pending': return '#6c757d';
      default: return '#6c757d';
    }
  }

  getStatusText(status: string): string {
    switch (status?.toLowerCase()) {
      case 'submitted': return 'Submitted';
      case 'under_review': return 'Under Review';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      case 'paid': return 'Paid';
      case 'pending': return 'Pending Payment';
      default: return status || 'Unknown';
    }
  }

  getPaymentStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'awaiting_approval': return '#0000FF';
      case 'paid': return '#28a745';
      case 'completed': return '#28a745';
      case 'pending': return '#9c640c';
      case 'rejected': return '#dc3545';
      case 'failed': return '#dc3545';
      default: return '#6c757d';
    }
  }

  getPaymentStatusText(status: string): string {
    switch (status?.toLowerCase()) {
      case 'awaiting_approval': return 'Awaiting Approval';
      case 'paid': return 'Paid';
      case 'completed': return 'Completed';
      case 'pending': return 'Pending';
      case 'rejected': return 'Rejected';
      case 'failed': return 'Failed';
      default: return status || 'Pending';
    }
  }

  viewApplication(application: any) {
    console.log('=== VIEWING APPLICATION ===');
    console.log('Application:', application);
    this.selectedApplication = application;
    this.showDetailsDialog = true;
  }

  closeApplicationDetails() {
    this.selectedApplication = null;
    this.showDetailsDialog = false;
  }

  async payNow(application: any) {
    console.log('=== INITIATING PAYMENT ===');
    console.log('Application for payment:', application);
    console.log('Current showPaymentDialog value:', this.showPaymentDialog);
    
    try {
      // Show payment dialog for user to choose payment method
      this.showPaymentDialog = true;
      this.selectedApplication = application;
      
      console.log('After setting showPaymentDialog:', this.showPaymentDialog);
      console.log('Selected application:', this.selectedApplication);
      
    } catch (error) {
      console.error('Error initiating payment:', error);
      this.notificationService.error('Error', 'Failed to initiate payment');
    }
  }

  async initiateSecurePayment() {
    if (!this.selectedApplication) return;
    
    try {
      // Step 1: Process payment using surface water permit service
      const paymentData = {
        amount: this.selectedApplication.paymentStatus.amount || 5000.00,
        currency: 'MWK',
        paymentMethod: 'BOMAPAY',
        orderNumber: 'NWRA-' + Date.now(),
        description: `Payment for ${this.selectedApplication.licenseType} - Application ${this.selectedApplication.id}`
      };
      
      console.log('Processing payment:', paymentData);
      
      const result = await this.surfaceWaterPermitService.processPayment(this.selectedApplication.id, paymentData);
      console.log('Payment processed:', result);
      
      // Step 2: Handle payment response
      if (result.status === 'COMPLETED') {
        this.notificationService.success('Success', 'Payment completed successfully!');
        this.showPaymentDialog = false;
        
        // Reload applications to reflect payment
        await this.loadApplications();
        
      } else {
        this.notificationService.info('Info', 'Payment is being processed. Please check back later.');
        this.showPaymentDialog = false;
      }
      
    } catch (error) {
      console.error('Error initiating secure payment:', error);
      this.notificationService.error('Error', 'Failed to initiate secure payment');
    }
  }

  // Payment method selection no longer needed since users choose on BOMAPay's secure page

  closePaymentDialog() {
    this.showPaymentDialog = false;
    this.selectedApplication = null;
  }

  downloadInvoice(application: any) {
    console.log('=== DOWNLOADING INVOICE ===');
    console.log('Application:', application);
    
    // Generate download link for invoice
    const invoiceUrl = `${environment.apiURL}/applications/${application.id}/invoice/download`;
    window.open(invoiceUrl, '_blank');
  }

  previewInvoice(application: any) {
    console.log('=== PREVIEWING INVOICE ===');
    console.log('Application:', application);
    
    this.selectedApplication = application;
    this.invoicePreviewUrl = `${environment.apiURL}/applications/${application.id}/invoice/download`;
    this.showInvoicePreview = true;
  }

  closeInvoicePreview() {
    this.showInvoicePreview = false;
    this.invoicePreviewUrl = '';
    this.selectedApplication = null;
  }

  uploadReceipt(application: any) {
    console.log('=== UPLOADING RECEIPT ===');
    console.log('Application:', application);
    
    this.selectedApplication = application;
    this.showReceiptUpload = true;
  }

  closeReceiptUpload() {
    this.showReceiptUpload = false;
    this.selectedApplication = null;
    this.selectedFile = null;
    this.selectedPaymentMethod = '';
    this.uploadNotes = '';
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validate file type and size
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      const maxSizeInMB = 5;
      
      if (!allowedTypes.includes(file.type)) {
        this.notificationService.error('Error', 'Please select a valid image (JPG, PNG) or PDF file');
        return;
      }
      
      if (file.size > maxSizeInMB * 1024 * 1024) {
        this.notificationService.error('Error', 'File size should be less than 5MB');
        return;
      }
      
      this.selectedFile = file;
    }
  }

  async submitReceiptUpload() {
    if (!this.selectedFile || !this.selectedPaymentMethod || !this.selectedApplication) {
      this.notificationService.error('Error', 'Please select a file and payment method');
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('receipt', this.selectedFile);
      formData.append('paymentMethod', this.selectedPaymentMethod);
      formData.append('notes', this.uploadNotes);
      
      // Add license requirement ID if available
      if (this.selectedApplication.licenseRequirementId) {
        formData.append('license_requirement_id', this.selectedApplication.licenseRequirementId);
      }
      
      // Add amount if available
      if (this.selectedApplication.applicationFees) {
        formData.append('amount', this.selectedApplication.applicationFees.toString());
      }
      
      // applicationId is now in the URL path
      
      // Upload receipt to backend
      const response = await fetch(`${environment.apiURL}/workflow/upload-receipt/${this.selectedApplication.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      
      if (response.ok) {
        this.notificationService.success('Success', 'Receipt uploaded successfully! Your payment will be verified shortly.');
        this.closeReceiptUpload();
        
        // Reload applications to reflect changes
        await this.loadApplications();
      } else {
        throw new Error('Upload failed');
      }
      
    } catch (error) {
      console.error('Error uploading receipt:', error);
      this.notificationService.error('Error', 'Failed to upload receipt. Please try again.');
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    
    // Handle different date formats from backend
    let date: Date;
    if (dateString.includes('-') && dateString.length === 10) {
      // Format: 2025-08-09
      date = new Date(dateString);
    } else if (dateString.includes(' ')) {
      // Format: 2025-07-09 19:17:48 or Wed Jul 09 22:17:48 EAT 2025
      date = new Date(dateString);
    } else {
      date = new Date(dateString);
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  async checkPaymentStatus(orderId: string, applicationId: string) {
    try {
      console.log('Checking payment status for order:', orderId);
      
      const statusResponse = await fetch(`${environment.apiURL}/application-payments/bomapay/status/${orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (statusResponse.ok) {
        const statusResult = await statusResponse.json();
        console.log('Payment status:', statusResult);
        
        if (statusResult.orderStatus === 2) { // Payment successful
          this.notificationService.success('Success', 'Payment completed successfully!');
          this.showPaymentDialog = false;
          
          // Reload applications to reflect payment
          await this.loadApplications();
          
        } else if (statusResult.orderStatus === 6) { // Payment failed
          this.notificationService.error('Error', 'Payment failed. Please try again.');
        } else {
          this.notificationService.info('Info', 'Payment is being processed. Please wait.');
          
          // Poll for status updates every 5 seconds
          setTimeout(() => {
            this.checkPaymentStatus(orderId, applicationId);
          }, 5000);
        }
      } else {
        throw new Error('Status check failed');
      }
      
    } catch (error) {
      console.error('Error checking payment status:', error);
      this.notificationService.error('Error', 'Unable to check payment status');
    }
  }

  formatCurrency(amount: number): string {
    if (!amount) return 'N/A';
    return `MWK ${new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)}`;
  }

  setSelectedApp(app: any) {
    this.selectedApp = app;
  }

  downloadReceiptTemplate() {
    // This could be a template or instructions for payment
    const templateUrl = `${environment.apiURL}/templates/payment-receipt-template.pdf`;
    window.open(templateUrl, '_blank');
  }
}