import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class SurfaceWaterPermitService {

  constructor(private apiService: ApiService) { }

  async applyForPermit(applicationData: any): Promise<any> {
    try {
      // Get SUBMITTED status ID
      const statusResponse = await this.apiService.api<any>('GET', '/application-statuses');
      const submittedStatus = statusResponse?.find((status: any) => status.name === 'SUBMITTED');
      
      // Add status ID to application data
      const dataWithStatus = {
        ...applicationData,
        application_status_id: submittedStatus?.id
      };
      
      const response = await this.apiService.api<any>('POST', '/license-applications/surface-water-permit', dataWithStatus);
      return response;
    } catch (error) {
      console.error('Error applying for surface water permit:', error);
      throw error;
    }
  }

  async getMyApplications(): Promise<any[]> {
    try {
      return await this.apiService.api<any[]>('GET', '/surface-water-permits/my-applications');
    } catch (error) {
      console.error('Error getting my surface water applications:', error);
      throw error;
    }
  }

  async getAllApplications(page: number = 0, limit: number = 50): Promise<any[]> {
    try {
      return await this.apiService.api<any[]>('GET', `/surface-water-permits/all?page=${page}&limit=${limit}`);
    } catch (error) {
      console.error('Error getting all surface water applications:', error);
      throw error;
    }
  }

  async getApplicationStatus(applicationId: string): Promise<any> {
    try {
      return await this.apiService.api<any>('GET', `/surface-water-permits/${applicationId}/status`);
    } catch (error) {
      console.error('Error getting application status:', error);
      throw error;
    }
  }

  async processPayment(applicationId: string, paymentData: any): Promise<any> {
    try {
      console.log('=== PROCESSING PAYMENT ===');
      console.log('Application ID:', applicationId);
      console.log('Payment data:', paymentData);
      
      const response = await this.apiService.api<any>('POST', `/surface-water-permits/${applicationId}/process-payment`, paymentData);
      console.log('Payment response:', response);
      
      return response;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  }

  async generateInvoice(applicationId: string, invoiceData: any): Promise<any> {
    try {
      console.log('=== GENERATING INVOICE ===');
      console.log('Application ID:', applicationId);
      console.log('Invoice data:', invoiceData);
      
      const response = await this.apiService.api<any>('POST', `/surface-water-permits/${applicationId}/generate-invoice`, invoiceData);
      console.log('Invoice response:', response);
      
      return response;
    } catch (error) {
      console.error('Error generating invoice:', error);
      throw error;
    }
  }

  async approveApplication(applicationId: string, approvalData: any): Promise<any> {
    try {
      console.log('=== APPROVING APPLICATION ===');
      console.log('Application ID:', applicationId);
      console.log('Approval data:', approvalData);
      
      const response = await this.apiService.api<any>('PUT', `/surface-water-permits/${applicationId}/approve`, approvalData);
      console.log('Approval response:', response);
      
      return response;
    } catch (error) {
      console.error('Error approving application:', error);
      throw error;
    }
  }

  async rejectApplication(applicationId: string, rejectionData: any): Promise<any> {
    try {
      console.log('=== REJECTING APPLICATION ===');
      console.log('Application ID:', applicationId);
      console.log('Rejection data:', rejectionData);
      
      const response = await this.apiService.api<any>('PUT', `/surface-water-permits/${applicationId}/reject`, rejectionData);
      console.log('Rejection response:', response);
      
      return response;
    } catch (error) {
      console.error('Error rejecting application:', error);
      throw error;
    }
  }

  async referBackApplication(applicationId: string, referralData: any): Promise<any> {
    try {
      console.log('=== REFERRING BACK APPLICATION ===');
      console.log('Application ID:', applicationId);
      console.log('Referral data:', referralData);
      
      const response = await this.apiService.api<any>('PUT', `/surface-water-permits/${applicationId}/refer-back`, referralData);
      console.log('Referral response:', response);
      
      return response;
    } catch (error) {
      console.error('Error referring back application:', error);
      throw error;
    }
  }

  async downloadPermitPDF(licenseId: string): Promise<Blob> {
    try {
      console.log('=== DOWNLOADING PERMIT PDF ===');
      console.log('License ID:', licenseId);
      
      // This would need to be handled differently for file downloads
      const response = await fetch(`/api/v1/surface-water-permits/permits/${licenseId}/download`, {
        method: 'GET',
        headers: {
          'Authorization': localStorage.getItem('token') || ''
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to download permit PDF');
      }
      
      return await response.blob();
    } catch (error) {
      console.error('Error downloading permit PDF:', error);
      throw error;
    }
  }
}