import {Injectable} from '@angular/core';
import {CoreLicenseApplication} from "../schema/core-license-application";
import {CrudService} from "./crud.service";
import {ApiService} from "./api.service";
import {CoreApplicationStep} from "../schema/core-application-step";
import {CoreApplicationStatus} from "../models/core-application-status";

@Injectable({
    providedIn: 'root'
})
export class CoreLicenseApplicationService extends CrudService<CoreLicenseApplication> {
    constructor(apiService: ApiService) {
        super(apiService, '/license-applications', 'id');
    }

    async getApplicationsByUser(userId: string): Promise<any[]> {
        try {
            return await this.apiService.api<any[]>('GET', `/license-applications/user/${userId}`);
        } catch (error) {
            console.error('Error getting applications by user:', error);
            throw error;
        }
    }

    async getApplicationsByCurrentUser(): Promise<any[]> {
        try {
            return await this.apiService.api<any[]>('GET', '/license-applications/my-applications');
        } catch (error) {
            console.error('Error getting current user applications:', error);
            throw error;
        }
    }

    async getMyApplications(): Promise<any[]> {
        try {
            return await this.apiService.api<any[]>('GET', '/license-applications/my-applications');
        } catch (error) {
            console.error('Error getting my applications:', error);
            return [];
        }
    }

    async submitSurfaceWaterPermitApplication(applicationData: any): Promise<any> {
        try {
            const response = await this.apiService.api<any>('POST', '/surface-water-permits/apply', applicationData);
            console.log('Surface water permit application response:', response);

            return response;
        } catch (error) {
            console.error('Error submitting surface water permit application:', error);
            throw error;
        }
    }

    async getMySurfaceWaterApplications(): Promise<any[]> {
        try {
            return await this.apiService.api<any[]>('GET', '/surface-water-permits/my-applications');
        } catch (error) {
            console.error('Error getting my surface water applications:', error);
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

    async updateStatus(applicationId: string, status: CoreApplicationStatus): Promise<any> {
        try {
            const res = await this.apiService.api<any[]>("GET", "/application-statuses?page=0&limit=50")

            const stausId = res.filter((item: any) => item.name === status)[0].id
            const data = {
                application_status_id: stausId
            }
            return await this.apiService.api<any>('PUT', `/license-applications/${applicationId}`,data);
        } catch (error) {
            console.error('Error getting application status:', error);
            throw error;
        }
    }

    async getApplicationStep(applicationId: string): Promise<CoreApplicationStep | null> {
        try {
            return await this.apiService.api<any>('GET', `/application-steps/${applicationId}`);
        } catch (error) {
            console.error('Error getting application step:', error);
            throw error;
        }
    }

    async processPayment(applicationId: string, paymentData: any): Promise<any> {
        try {
            return await this.apiService.api<any>('POST', `/surface-water-permits/${applicationId}/process-payment`, paymentData);
        } catch (error) {
            console.error('Error processing payment:', error);
            throw error;
        }
    }

    async generateInvoice(applicationId: string, invoiceData: any): Promise<any> {
        try {
            return await this.apiService.api<any>('POST', `/surface-water-permits/${applicationId}/generate-invoice`, invoiceData);
        } catch (error) {
            console.error('Error generating invoice:', error);
            throw error;
        }
    }

    // Override the create method to use surface water permit endpoint for surface water applications
    override async create(data: any): Promise<any> {
        try {
            // Get application status ID for SUBMITTED status
            const statusResponse = await this.apiService.api<any>('GET', '/application-statuses?name=SUBMITTED');
            const submittedStatus = statusResponse?.find((status: any) => status.name === 'SUBMITTED');

            // Prepare application data with required IDs
            const applicationData = {
                ...data,
                license_type_id: data.licenseTypeId || data.license_type_id,
                application_status_id: submittedStatus?.id,
                licenseType: 'Surface Water Permit',
                wApplicationType: 'Surface Water Permit'
            };

            // Validate required fields
            if (!applicationData.license_type_id) {
                throw new Error('License type ID is required');
            }

            // Check if this is a surface water permit application
            if (data.licenseType === 'Surface Water Permit' ||
                data.wApplicationType?.toLowerCase().includes('surface water')) {
                return await this.submitSurfaceWaterPermitApplication(applicationData);
            }

            // Fall back to the original create method for other types
            return await super.create(applicationData);
        } catch (error) {
            console.error('Error creating application:', error);
            throw error;
        }
    }

    async getApplicationsById(id: string): Promise<CoreLicenseApplication> {
        try {
            return await this.apiService.api<CoreLicenseApplication>('GET', `/license-applications/${id}`);
        } catch (error) {
            console.error('Error getting applications by user:', error);
            throw error;
        }
    }
}
