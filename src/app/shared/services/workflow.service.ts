import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) { }

  // Get applications based on user role
  async getApplicationsForRole(): Promise<any[]> {
    try {
      const user = await this.authService.getCurrentUser();
      const userRole = user?.sysUserGroup?.name?.toLowerCase();
      
      console.log('Getting applications for role:', userRole);
      
      switch (userRole) {
        case 'applicant':
          return await this.apiService.api<any[]>('GET', '/license-applications/my-applications');
        
        case 'licensing_officer':
        case 'licensing_manager':
        case 'drs':
        case 'ceo':
        case 'accountant':
          return await this.apiService.api<any[]>('GET', '/license-applications/');
        
        default:
          return [];
      }
    } catch (error) {
      console.error('Error getting applications for role:', error);
      throw error;
    }
  }

  // Get applications pending action for current user role
  async getPendingApplications(): Promise<any[]> {
    try {
      const user = await this.authService.getCurrentUser();
      const userRole = user?.sysUserGroup?.name?.toLowerCase();
      
      console.log('Getting pending applications for role:', userRole);
      
      const allApplications = await this.getApplicationsForRole();
      
      return allApplications.filter(app => {
        const status = app.status?.toLowerCase();
        
        switch (userRole) {
          case 'licensing_officer':
            return ['submitted', 'pending_review', 'field_assessment_required'].includes(status);
          
          case 'licensing_manager':
            return ['pending_manager_approval', 'field_assessment_complete'].includes(status);
          
          case 'drs':
            return ['pending_drs_approval', 'scheduled_for_approval'].includes(status);
          
          case 'ceo':
            return ['pending_ceo_approval', 'board_review_required'].includes(status);
          
          case 'accountant':
            return ['approved', 'pending_invoice', 'payment_pending'].includes(status);
          
          default:
            return false;
        }
      });
    } catch (error) {
      console.error('Error getting pending applications:', error);
      throw error;
    }
  }

  // Process application based on user role and action
  async processApplication(applicationId: string, action: string, data: any): Promise<any> {
    try {
      const user = await this.authService.getCurrentUser();
      const userRole = user?.sysUserGroup?.name?.toLowerCase();
      
      console.log('Processing application:', applicationId, 'Action:', action, 'Role:', userRole);
      
      switch (action) {
        case 'approve':
        case 'reject':
        case 'refer_back':
        case 'request_field_assessment':
        case 'schedule_for_approval':
          // Use the new workflow controller
          const formData = new FormData();
          formData.append('action', action);
          formData.append('notes', data.notes || '');
          formData.append('userRole', userRole || '');
          
          const response = await fetch(`/api/v1/workflow/process-action/${applicationId}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
          });
          
          if (!response.ok) {
            throw new Error('Failed to process workflow action');
          }
          
          return await response.json();
        
        case 'calculate_rentals':
          return await this.calculateRentals(applicationId, data);
        
        case 'generate_invoice':
          return await this.apiService.api<any>('POST', `/surface-water-permits/${applicationId}/generate-invoice`, data);
        
        default:
          throw new Error('Unknown action: ' + action);
      }
    } catch (error) {
      console.error('Error processing application:', error);
      throw error;
    }
  }

  // Get available actions for current user role and application status
  getAvailableActions(application: any): string[] {
    const userRole = this.authService.getCurrentUser()?.sysUserGroup?.name?.toLowerCase();
    const status = application.status?.toLowerCase();
    
    switch (userRole) {
      case 'licensing_officer':
        if (['submitted', 'pending_review'].includes(status)) {
          return ['approve', 'reject', 'refer_back', 'request_field_assessment'];
        }
        if (status === 'field_assessment_complete') {
          return ['upload_field_results', 'calculate_rentals', 'schedule_for_approval'];
        }
        break;
      
      case 'licensing_manager':
        if (['pending_manager_approval', 'field_assessment_required'].includes(status)) {
          return ['approve', 'reject', 'refer_back'];
        }
        break;
      
      case 'drs':
        if (['pending_drs_approval', 'scheduled_for_approval'].includes(status)) {
          return ['approve', 'reject', 'refer_back'];
        }
        break;
      
      case 'ceo':
        if (['pending_ceo_approval', 'board_review_required'].includes(status)) {
          return ['approve', 'reject', 'refer_back'];
        }
        break;
      
      case 'accountant':
        if (['approved', 'pending_invoice'].includes(status)) {
          return ['generate_invoice'];
        }
        break;
      
      default:
        return [];
    }
    
    return [];
  }

  // Get workflow step information
  getWorkflowStepInfo(userRole: string): any {
    const steps = {
      'licensing_officer': {
        title: 'Licensing Officer Tasks',
        description: 'Review applications, request field assessments, upload results',
        icon: '📋',
        color: '#007bff'
      },
      'licensing_manager': {
        title: 'Licensing Manager Tasks',
        description: 'Approve field assessments and schedule applications',
        icon: '✅',
        color: '#28a745'
      },
      'drs': {
        title: 'DRS Tasks',
        description: 'Authorize applications for CEO/Board approval',
        icon: '🔐',
        color: '#ffc107'
      },
      'ceo': {
        title: 'CEO Tasks',
        description: 'Final approval and board minutes update',
        icon: '👑',
        color: '#dc3545'
      },
      'accountant': {
        title: 'Accountant Tasks',
        description: 'Generate invoices and manage payments',
        icon: '💰',
        color: '#17a2b8'
      }
    };
    
    return steps[userRole] || {
      title: 'Tasks',
      description: 'Manage your assigned tasks',
      icon: '📝',
      color: '#6c757d'
    };
  }

  // Upload field assessment results
  async uploadFieldResults(applicationId: string, files: FileList, notes: string): Promise<any> {
    try {
      const formData = new FormData();
      
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
      
      formData.append('notes', notes);
      
      const response = await fetch(`/api/v1/workflow/upload-field-results/${applicationId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload field results');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error uploading field results:', error);
      throw error;
    }
  }

  // Calculate annual rentals
  async calculateRentals(applicationId: string, calculationData: any): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('quantity', calculationData.quantity?.toString() || '0');
      formData.append('rate', calculationData.rate?.toString() || '0');
      formData.append('notes', calculationData.notes || '');
      
      const response = await fetch(`/api/v1/workflow/calculate-rentals/${applicationId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to calculate rentals');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error calculating rentals:', error);
      throw error;
    }
  }
}