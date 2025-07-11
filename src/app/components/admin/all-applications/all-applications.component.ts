import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { COMMON_MODULES } from '../../../custom-material/custom-material.module';
import { CoreLicenseApplicationService } from '../../../shared/services/core-license-application.service';
import { CoreLicenseTypeService } from '../../../shared/services/core-license-type.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { environment } from '../../../../environments/environment';
import { ApplicationDetailsDialogComponent } from './application-details-dialog.component';

@Component({
  selector: 'app-all-applications',
  standalone: true,
  imports: [CommonModule, ...COMMON_MODULES],
  templateUrl: './all-applications.component.html',
  styleUrl: './all-applications.component.scss'
})
export class AllApplicationsComponent implements OnInit {

  applications: any[] = [];
  filteredApplications: any[] = [];
  licenseTypes: any[] = [];
  loading: boolean = true;
  
  // Filters
  selectedPaymentStatus: string = '';
  selectedLicenseType: string = '';
  
  // Payment receipts dialog
  showPaymentReceiptsDialog: boolean = false;
  selectedApplication: any = null;
  paymentReceipts: any[] = [];
  loadingReceipts: boolean = false;
  
  

  constructor(
    private applicationService: CoreLicenseApplicationService,
    private licenseTypeService: CoreLicenseTypeService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {}

  async ngOnInit() {
    try {
      await this.loadLicenseTypes();
      await this.loadApplications();
    } catch (error) {
      console.error('Error loading data:', error);
      this.notificationService.error('Error', 'Failed to load applications');
    } finally {
      this.loading = false;
    }
  }

  async loadApplications() {
    try {
      this.applications = await this.applicationService.getAll();
      this.filteredApplications = [...this.applications];
    } catch (error) {
      console.error('Error loading applications:', error);
      throw error;
    }
  }

  async loadLicenseTypes() {
    try {
      this.licenseTypes = await this.licenseTypeService.getAll();
    } catch (error) {
      console.error('Error loading license types:', error);
    }
  }

  applyFilters() {
    this.filteredApplications = this.applications.filter(app => {
      const paymentMatch = !this.selectedPaymentStatus || 
        app.paymentStatus?.status?.toLowerCase() === this.selectedPaymentStatus.toLowerCase();
      
      const licenseMatch = !this.selectedLicenseType || 
        app.licenseType === this.selectedLicenseType;
      
      return paymentMatch && licenseMatch;
    });
  }

  clearFilters() {
    this.selectedPaymentStatus = '';
    this.selectedLicenseType = '';
    this.filteredApplications = [...this.applications];
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

  getPaymentStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'completed': 
      case 'paid': return '#28a745';
      case 'pending': return '#ffc107';
      case 'failed': return '#dc3545';
      default: return '#6c757d';
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

  formatCurrency(amount: number): string {
    if (!amount) return 'N/A';
    return `MWK ${new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)}`;
  }

  viewApplication(application: any) {
    const index = this.filteredApplications.findIndex(app => app.id === application.id);
    
    const dialogRef = this.dialog.open(ApplicationDetailsDialogComponent, {
      width: '95vw',
      maxWidth: '1200px',
      height: 'auto',
      maxHeight: '90vh',
      panelClass: 'application-details-dialog-container',
      data: {
        selectedApplication: application,
        currentApplicationIndex: index,
        filteredApplications: this.filteredApplications
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle any data returned from the dialog if needed
      // console.log('Dialog was closed');
    });
  }

  emailApplicant(application: any) {
    console.log('Emailing applicant:', application);
    // TODO: Implement email functionality
    this.notificationService.info('Email', `Preparing email for ${application.applicantEmail}`);
  }

  async viewPaymentReceipts(application: any) {
    // console.log('=== VIEWING PAYMENT RECEIPTS ===');
    // console.log('Application:', application);
    
    this.selectedApplication = application;
    this.showPaymentReceiptsDialog = true;
    this.loadingReceipts = true;
    
    try {
      const url = `${environment.apiURL}/license-applications/${application.id}/payment-receipts`;
      console.log('Fetching receipts from:', url);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Payment receipts data:', data);
        // Handle both array and single object responses
        this.paymentReceipts = Array.isArray(data) ? data : (data.receipts || [data]);
      } else {
        console.error('Failed to fetch receipts:', response.statusText);
        this.paymentReceipts = [];
        this.notificationService.error('Error', 'Failed to load payment receipts');
      }
    } catch (error) {
      console.error('Error loading payment receipts:', error);
      this.paymentReceipts = [];
      this.notificationService.error('Error', 'Failed to load payment receipts');
    } finally {
      this.loadingReceipts = false;
    }
  }

  closePaymentReceiptsDialog() {
    this.showPaymentReceiptsDialog = false;
    this.selectedApplication = null;
    this.paymentReceipts = [];
  }

  viewReceiptDocument(documentId: string) {
    const receiptUrl = `${environment.apiURL}/workflow/view-receipt/${documentId}`;
    window.open(receiptUrl, '_blank');
  }

  async approvePayment(application: any) {
    try {
      const response = await fetch(`${environment.apiURL}/workflow/approve-payment/${application.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'notes=Payment approved by accountant'
      });
      
      if (response.ok) {
        this.notificationService.success('Success', 'Payment approved successfully!');
        this.closePaymentReceiptsDialog();
        await this.loadApplications(); // Refresh the list
      } else {
        this.notificationService.error('Error', 'Failed to approve payment');
      }
    } catch (error) {
      console.error('Error approving payment:', error);
      this.notificationService.error('Error', 'Failed to approve payment');
    }
  }

  async rejectPayment(application: any) {
    try {
      const response = await fetch(`${environment.apiURL}/workflow/reject-payment/${application.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'notes=Payment rejected by accountant'
      });
      
      if (response.ok) {
        this.notificationService.success('Success', 'Payment rejected');
        this.closePaymentReceiptsDialog();
        await this.loadApplications(); // Refresh the list
      } else {
        this.notificationService.error('Error', 'Failed to reject payment');
      }
    } catch (error) {
      console.error('Error rejecting payment:', error);
      this.notificationService.error('Error', 'Failed to reject payment');
    }
  }
}