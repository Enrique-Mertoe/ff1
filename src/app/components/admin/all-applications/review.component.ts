import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatTabsModule} from "@angular/material/tabs";
import {CoreLicenseApplicationService} from "../../../shared/services/core-license-application.service";
import {LicenseApplicationManager} from "../../../shared/managers/core-license-application.manager";

interface ValidationResult {
    icon: string;
    message: string;
    valid: boolean;
    value: string;
}

interface ValidationSummary {
    valid: number;
    invalid: number;
    percentage: number;
}

@Component({
    selector: 'app-review',
    standalone: true,
    imports: [CommonModule, FormsModule, MatButton, MatIconModule, MatTabsModule],
    template: `
        <div class="w-full min-h-full bg-white">
            <!-- Initial Review Button -->
            <div *ngIf="!showReviewMode" class="flex py-6 justify-center">
                <button
                        mat-stroked-button
                        (click)="startReview()"
                        [disabled]="loadingReview"
                        class="bg-sky-600 !hover:bg-sky-700 disabled:bg-sky-400 text-white cursor-pointer px-6 py-3 rounded-sm font-medium transition-colors duration-200 flex items-center gap-2"
                >
                    <span class="flex items-center gap-1" *ngIf="!loadingReview">
                        
                        <mat-icon>search</mat-icon>
                        Start Application Review</span>
                    <span *ngIf="loadingReview" class="flex items-center gap-2">
            <div class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            Starting Review...
          </span>
                </button>
            </div>

            <!-- Review Mode -->
            <div *ngIf="showReviewMode" class="w-full">
                <!-- Review Header -->
                <div class="bg-gradient-to-b from-sky-200 to-transparent text-sky-800 flex justify-between items-center">
                    <h5 class="text-md font-semibold flex items-center gap-2">
                        🔍 Application Review
                    </h5>
                </div>

                <!-- Loading State -->
                <div *ngIf="loadingReview" class="pt-3 text-center">
                    <div class="flex flex-col items-center gap-4">
                        <div class="animate-spin rounded-full h-12 w-12 border-4 border-sky-600 border-t-transparent"></div>
                        <span class="text-gray-600 text-lg">Loading application details...</span>
                    </div>
                </div>

                <!-- Review Content -->
                <div *ngIf="!loadingReview && applicationReviewData" class="">
                    <!-- Validation Summary -->
                    <div class="mb-6 p-3 bg-gray-white rounded-lg border border-gray-200">
                        <div class="flex flex-wrap gap-4 justify-center items-center">
              <span class="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                <mat-icon class="text-sm">check_circle</mat-icon>
                {{ getValidationSummary().valid }} Valid
              </span>
                            <span class="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                <mat-icon class="text-sm">error</mat-icon>
                {{ getValidationSummary().invalid }} Issues
              </span>
                            <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium"
                                  [ngClass]="{
                      'bg-green-100 text-green-800': getValidationSummary().percentage >= 80,
                      'bg-yellow-100 text-yellow-800': getValidationSummary().percentage >= 60 && getValidationSummary().percentage < 80,
                      'bg-red-100 text-red-800': getValidationSummary().percentage < 60
                    }">
                <mat-icon class="text-sm">analytics</mat-icon>
                {{ getValidationSummary().percentage }}% Complete
              </span>
                        </div>
                    </div>

                    <!-- Field Validation Results Tabs -->
                    <mat-tab-group class="w-full">
                        <!-- Applicant Information Tab -->
                        <mat-tab>
                            <ng-template mat-tab-label>
                                <mat-icon class="mr-2">person</mat-icon>
                                Applicant Information
                            </ng-template>
                            <div class="bg-white p-4 mt-4">
                                <div class="space-y-3">
                                    <div *ngFor="let field of [
                      {key: 'applicantName', label: 'Full Name', icon: 'person'},
                      {key: 'applicantEmail', label: 'Email Address', icon: 'email'},
                      {key: 'applicantPhone', label: 'Phone Number', icon: 'phone'}
                    ]" class="border-b border-gray-100 pb-2 last:border-b-0">
                                        <div class="flex items-center gap-2 mb-1">
                                            <mat-icon class="text-gray-500 text-sm">{{ field.icon }}</mat-icon>
                                            <span class="text-sm font-medium text-gray-700">{{ field.label }}:</span>
                                            <span class="text-xs px-2 py-1 rounded-full flex items-center gap-1"
                                                  [ngClass]="fieldValidationResults[field.key]?.valid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                          <mat-icon class="text-xs">{{ fieldValidationResults[field.key]?.icon }}</mat-icon>
                          {{ fieldValidationResults[field.key]?.message }}
                        </span>
                                        </div>
                                        <div class="text-sm text-gray-600 ml-6">{{ fieldValidationResults[field.key]?.value }}</div>
                                    </div>
                                </div>
                            </div>
                        </mat-tab>

                        <!-- Source Location Tab -->
                        <mat-tab>
                            <ng-template mat-tab-label>
                                <mat-icon class="mr-2">location_on</mat-icon>
                                Source Location
                            </ng-template>
                            <div class="bg-white p-4 mt-4">
                                <div class="space-y-3">
                                    <div *ngFor="let field of [
                      {key: 'sourceEasting', label: 'Easting Coordinate', icon: 'place'},
                      {key: 'sourceNorthing', label: 'Northing Coordinate', icon: 'place'},
                      {key: 'sourceOwnerFullname', label: 'Owner Name', icon: 'person'},
                      {key: 'sourcePlotNumber', label: 'Plot Number', icon: 'map'},
                      {key: 'sourceTa', label: 'Traditional Authority', icon: 'domain'},
                      {key: 'sourceVillage', label: 'Village', icon: 'home'},
                      {key: 'sourceHectarage', label: 'Hectarage', icon: 'straighten'},
                      {key: 'sourceLandRegime', label: 'Land Regime', icon: 'terrain'}
                    ]" class="border-b border-gray-100 pb-2 last:border-b-0">
                                        <div class="flex items-center gap-2 mb-1">
                                            <mat-icon class="text-gray-500 text-sm">{{ field.icon }}</mat-icon>
                                            <span class="text-sm font-medium text-gray-700">{{ field.label }}:</span>
                                            <span class="text-xs px-2 py-1 rounded-full flex items-center gap-1"
                                                  [ngClass]="fieldValidationResults[field.key]?.valid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                          <mat-icon class="text-xs">{{ fieldValidationResults[field.key]?.icon }}</mat-icon>
                          {{ fieldValidationResults[field.key]?.message }}
                        </span>
                                        </div>
                                        <div class="text-sm text-gray-600 ml-6">{{ fieldValidationResults[field.key]?.value }}</div>
                                    </div>
                                </div>
                            </div>
                        </mat-tab>

                        <!-- Destination Location Tab -->
                        <mat-tab>
                            <ng-template mat-tab-label>
                                <mat-icon class="mr-2">flag</mat-icon>
                                Destination Location
                            </ng-template>
                            <div class="bg-white p-4 mt-4">
                                <div class="space-y-3">
                                    <div *ngFor="let field of [
                      {key: 'destEasting', label: 'Easting Coordinate', icon: 'place'},
                      {key: 'destNorthing', label: 'Northing Coordinate', icon: 'place'},
                      {key: 'destOwnerFullname', label: 'Owner Name', icon: 'person'},
                      {key: 'destPlotNumber', label: 'Plot Number', icon: 'map'},
                      {key: 'destTa', label: 'Traditional Authority', icon: 'domain'},
                      {key: 'destVillage', label: 'Village', icon: 'home'},
                      {key: 'destHectarage', label: 'Hectarage', icon: 'straighten'},
                      {key: 'destLandRegime', label: 'Land Regime', icon: 'terrain'}
                    ]" class="border-b border-gray-100 pb-2 last:border-b-0">
                                        <div class="flex items-center gap-2 mb-1">
                                            <mat-icon class="text-gray-500 text-sm">{{ field.icon }}</mat-icon>
                                            <span class="text-sm font-medium text-gray-700">{{ field.label }}:</span>
                                            <span class="text-xs px-2 py-1 rounded-full flex items-center gap-1"
                                                  [ngClass]="fieldValidationResults[field.key]?.valid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                          <mat-icon class="text-xs">{{ fieldValidationResults[field.key]?.icon }}</mat-icon>
                          {{ fieldValidationResults[field.key]?.message }}
                        </span>
                                        </div>
                                        <div class="text-sm text-gray-600 ml-6">{{ fieldValidationResults[field.key]?.value }}</div>
                                    </div>
                                </div>
                            </div>
                        </mat-tab>

                        <!-- Water Source & Permit Details Tab -->
                        <mat-tab>
                            <ng-template mat-tab-label>
                                <mat-icon class="mr-2">water_drop</mat-icon>
                                Water Source & Permit Details
                            </ng-template>
                            <div class="bg-white p-4 mt-4">
                                <div class="space-y-3">
                                    <div *ngFor="let field of [
                      {key: 'coreWaterSource', label: 'Core Water Source', icon: 'water'},
                      {key: 'altWaterSource', label: 'Alternative Water Source', icon: 'waves'},
                      {key: 'altOtherWater', label: 'Other Water Source', icon: 'water_drop'},
                      {key: 'nearbyWaterUtilityBoard', label: 'Nearby Water Utility Board', icon: 'business'},
                      {key: 'existingBoreholeCount', label: 'Existing Borehole Count', icon: 'circle'},
                      {key: 'permitDuration', label: 'Permit Duration', icon: 'schedule'},
                      {key: 'dateSubmitted', label: 'Date Submitted', icon: 'calendar_today'}
                    ]" class="border-b border-gray-100 pb-2 last:border-b-0">
                                        <div class="flex items-center gap-2 mb-1">
                                            <mat-icon class="text-gray-500 text-sm">{{ field.icon }}</mat-icon>
                                            <span class="text-sm font-medium text-gray-700">{{ field.label }}:</span>
                                            <span class="text-xs px-2 py-1 rounded-full flex items-center gap-1"
                                                  [ngClass]="fieldValidationResults[field.key]?.valid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                          <mat-icon class="text-xs">{{ fieldValidationResults[field.key]?.icon }}</mat-icon>
                          {{ fieldValidationResults[field.key]?.message }}
                        </span>
                                        </div>
                                        <div class="text-sm text-gray-600 ml-6">{{ fieldValidationResults[field.key]?.value }}</div>
                                    </div>
                                </div>
                            </div>
                        </mat-tab>
                    </mat-tab-group>

                    <!-- Action Buttons -->
                    <div class="mt-8 flex justify-center gap-4">
                        <button
                                mat-stroked-button
                                (click)="referBack()"
                                class="px-6 py-3 border-orange-500 text-orange-600 hover:bg-orange-50 font-medium transition-colors duration-200 flex items-center gap-2"
                        >
                            <mat-icon>arrow_back</mat-icon>
                            Refer Back
                        </button>
                        <button
                                mat-stroked-button
                                (click)="continueAnyway()"
                                class="px-6 py-3 border-green-600 text-green-600 hover:bg-green-50 font-medium transition-colors duration-200 flex items-center gap-2"
                        >
                            Continue Anyway
                            <mat-icon>arrow_forward</mat-icon>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `,
    styleUrls: []
})
export class ReviewComponent implements OnInit {
    @Input() applicationData: any = null;
    @Output() onProceed = new EventEmitter<void>();
    @Output() onReferBack = new EventEmitter<void>();
    @Output() onContinueAnyway = new EventEmitter<void>();

    private la:LicenseApplicationManager

    constructor(
        private laService: CoreLicenseApplicationService
    ) {

    }

    showReviewMode = false;
    loadingReview = false;
    applicationReviewData: any = null;
    fieldValidationResults: { [key: string]: ValidationResult } = {};

    ngOnInit(): void {
        // Initialize with mock data for demonstration
        this.initializeMockData();
    }

    startReview(): void {
        console.log('=== STARTING APPLICATION REVIEW ===');
        console.log('Current application data:', this.applicationData);
        
        this.loadingReview = true;
        this.showReviewMode = true;

        // Initialize the review data immediately since we already have the application data
        this.initializeMockData().then(() => {
            this.performReviewAnalysis();
            this.loadingReview = false;
            console.log('=== REVIEW INITIALIZATION COMPLETE ===');
        }).catch(error => {
            console.error('=== ERROR DURING REVIEW INITIALIZATION ===', error);
            this.loadingReview = false;
        });
    }

    closeReviewMode(): void {
        this.showReviewMode = false;
        this.applicationReviewData = null;
    }

    proceedToWorkflowActions(): void {
        this.onProceed.emit();
    }

    referBack(): void {
        this.onReferBack.emit();
    }

    continueAnyway(): void {
        this.onContinueAnyway.emit();
    }

    private performReviewAnalysis(): void {
        // Simulate review analysis
        this.applicationReviewData = {
            reviewComplete: true,
            timestamp: new Date()
        };

        // This would normally come from your service
        this.generateValidationResults();
    }

    private async initializeMockData(): Promise<void> {
        console.log('=== INITIALIZING APPLICATION REVIEW DATA ===');
        console.log('Input applicationData:', this.applicationData);
        console.log('Application ID:', this.applicationData?.id);
        
        try {
            console.log('=== CALLING API TO GET APPLICATION DETAILS ===');
            console.log('Making API call to get application by ID:', this.applicationData.id);
            
            const res = await this.laService.getApplicationsById(this.applicationData.id);
            console.log('=== API RESPONSE RECEIVED ===');
            console.log('Raw API response:', res);
            console.log('Response type:', typeof res);
            console.log('Response keys:', Object.keys(res || {}));
            
            this.applicationData = res;
            this.la = new LicenseApplicationManager(res as any);
            const dt = this.la;
            
            console.log('=== LICENSE APPLICATION MANAGER CREATED ===');
            console.log('Manager raw data:', dt.raw);
            console.log('Manager applicant name:', dt.applicantName);
            console.log('Manager applicant email:', dt.applicantEmail);
            
            // Log specific field values for debugging
            console.log('=== FIELD VALUES FOR VALIDATION ===');
            console.log('sourceVillage:', dt.raw?.sourceVillage);
            console.log('sourceTa:', dt.raw?.sourceTa);
            console.log('sourceHectarage:', dt.raw?.sourceHectarage);
            console.log('destVillage:', dt.raw?.destVillage);
            console.log('destTa:', dt.raw?.destTa);
            console.log('destHectarage:', dt.raw?.destHectarage);
            console.log('altWaterSource:', dt.raw?.altWaterSource);
            console.log('altOtherWater:', dt.raw?.altOtherWater);
            console.log('nearbyWaterUtilityBoard:', dt.raw?.nearbyWaterUtilityBoard);
        
        // Helper function to validate field
        const validateField = (value: any, fieldName: string): ValidationResult => {
            if (value === null || value === undefined || value === '') {
                return {icon: 'error', message: 'Missing', valid: false, value: 'Not provided'};
            }
            return {icon: 'check_circle', message: 'Valid', valid: true, value: String(value)};
        };

        console.log('=== MAPPING FIELDS FOR VALIDATION ===');
        console.log('Available data keys:', Object.keys(res || {}));
        
        this.fieldValidationResults = {
            // Applicant Information - use direct properties from response
            'applicantName': validateField(res.applicantName, 'applicantName'),
            'applicantEmail': validateField(res.applicantEmail, 'applicantEmail'),
            'applicantPhone': validateField(res.applicantPhone || res.clientTelephone || res.clientMobile, 'applicantPhone'),

            // Source Location - use direct properties from response
            'sourceEasting': validateField(res.sourceEasting, 'sourceEasting'),
            'sourceNorthing': validateField(res.sourceNorthing, 'sourceNorthing'),
            'sourceOwnerFullname': validateField(res.sourceOwnerFullname, 'sourceOwnerFullname'),
            'sourcePlotNumber': validateField(res.sourcePlotNumber, 'sourcePlotNumber'),
            'sourceTa': validateField(res.sourceTa, 'sourceTa'),
            'sourceVillage': validateField(res.sourceVillage, 'sourceVillage'),
            'sourceHectarage': validateField(res.sourceHectarage, 'sourceHectarage'),
            'sourceLandRegime': validateField(res.sourceLandRegimeName, 'sourceLandRegime'),

            // Destination Location - use direct properties from response
            'destEasting': validateField(res.destEasting, 'destEasting'),
            'destNorthing': validateField(res.destNorthing, 'destNorthing'),
            'destOwnerFullname': validateField(res.destOwnerFullname, 'destOwnerFullname'),
            'destPlotNumber': validateField(res.destPlotNumber, 'destPlotNumber'),
            'destTa': validateField(res.destTa, 'destTa'),
            'destVillage': validateField(res.destVillage, 'destVillage'),
            'destHectarage': validateField(res.destHectarage, 'destHectarage'),
            'destLandRegime': validateField(res.destLandRegimeName, 'destLandRegime'),

            // Water Source & Permit Details - use direct properties from response
            'coreWaterSource': validateField(res.waterSourceName, 'coreWaterSource'),
            'altWaterSource': validateField(res.altWaterSource, 'altWaterSource'),
            'altOtherWater': validateField(res.altOtherWater, 'altOtherWater'),
            'nearbyWaterUtilityBoard': validateField(res.nearbyWaterUtilityBoard, 'nearbyWaterUtilityBoard'),
            'existingBoreholeCount': validateField(res.existingBoreholeCount, 'existingBoreholeCount'),
            'permitDuration': validateField(res.permitDuration, 'permitDuration'),
            'dateSubmitted': validateField(res.dateSubmitted, 'dateSubmitted')
        };
        
        console.log('=== VALIDATION RESULTS AFTER MAPPING ===');
        Object.keys(this.fieldValidationResults).forEach(key => {
            const result = this.fieldValidationResults[key];
            console.log(`${key}: ${result.valid ? '✓' : '✗'} - ${result.value}`);
        });
        
        console.log('=== FINAL VALIDATION SUMMARY ===');
        console.log('Total validation results:', Object.keys(this.fieldValidationResults).length);
        const summary = this.getValidationSummary();
        console.log('Validation summary:', summary);
        console.log(`Completion: ${summary.valid}/${summary.valid + summary.invalid} (${summary.percentage}%)`);
        
        } catch (error) {
            console.error('=== ERROR IN INITIALIZE MOCK DATA ===');
            console.error('Error details:', error);
            console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
        }
    }

    private generateValidationResults(): void {
        // This method would normally process actual application data
        // For now, we use the mock data initialized in initializeMockData
    }

    getValidationSummary(): ValidationSummary {
        const results = Object.values(this.fieldValidationResults);
        const valid = results.filter(r => r.valid).length;
        const invalid = results.filter(r => !r.valid).length;
        const total = results.length;
        const percentage = total > 0 ? Math.round((valid / total) * 100) : 0;

        return {valid, invalid, percentage};
    }
}