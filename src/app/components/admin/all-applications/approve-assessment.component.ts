import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatTabsModule} from "@angular/material/tabs";
import {CoreLicenseApplicationService} from "../../../shared/services/core-license-application.service";
import {LicenseApplicationManager} from "../../../shared/managers/core-license-application.manager";
import {MatChipRow} from "@angular/material/chips";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {ApiService} from "../../../shared/services/api.service";
import {CoreApplicationStatus} from "../../../shared/models/core-application-status";

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
    selector: 'app-approve-assessment',
    standalone: true,
    imports: [CommonModule, FormsModule, MatButton, MatIconModule, MatTabsModule, MatChipRow, MatProgressSpinner],
    template: `
        <div class="w-full min-h-full bg-slate-50">
            <!-- Comments Section -->
            <div class="p-6 bg-slate-50">
                <div class="mb-6">
                    <p class="text-lg font-medium text-gray-800 mb-4">Field Assessment Review : <i class="font-bold">John
                        dee</i></p>
                    <div class="space-y-4">
                        <div class="bg-white p-3 rounded-lg">
                            <p class="text-gray-600">Initial assessment looks good. Ready for field review.</p>

                            <span class="font-bold">Schedule:</span>
                            <mat-chip-row
                            >
                                <button>
                                    <mat-icon>calendar</mat-icon>
                                </button>
                                {{ "currentDate" | date:'MMM d, y - h:mm a' }}
                            </mat-chip-row>
                        </div>

                    </div>
                </div>
            </div>

            <div class="flex flex-col gap-2  p-6 justify-center">
                <button
                        mat-stroked-button
                        (click)="referBack()"
                        [disabled]="isLoading"
                        class="bg-sky-600 !hover:bg-sky-700 disabled:bg-sky-400 text-white cursor-pointer px-6 py-3 rounded-sm font-medium transition-colors duration-200 flex items-center gap-2"
                >
            <span class="flex items-center gap-1">
                <mat-icon>arrow-left</mat-icon>
                Refer back</span>
                </button>
                <button
                        mat-stroked-button
                        (click)="approveForAssessment()"
                        [disabled]="isLoading"
                        class="bg-sky-600 !hover:bg-sky-700 disabled:bg-sky-400 text-white cursor-pointer px-6 py-3 rounded-sm font-medium transition-colors duration-200 flex items-center gap-2"
                >
            <span class="flex items-center gap-1">
                  <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
                <mat-icon *ngIf="!isLoading">check</mat-icon>
                Approve for Field Assessment</span>
                </button>

            </div>

        </div>
    `,
    styleUrls: []
})
export class ApproveAssessmentComponent implements OnInit {
    @Input() applicationData: any = null;
    @Output() onProceed = new EventEmitter<void>();
    @Output() onReferBack = new EventEmitter<void>();
    @Output() onContinueAnyway = new EventEmitter<void>();

    private la: LicenseApplicationManager

    constructor(
        private laService: CoreLicenseApplicationService,
        private apiService: ApiService
    ) {

    }

    isLoading = false;
    applicationReviewData: any = null;

    async ngOnInit(): Promise<void> {
        // Initialize with mock data for demonstration
        await this.initializeData();
    }

    approveForAssessment(): void {
        this.isLoading = true;
        this.laService.updateStatus(this.applicationData.id, CoreApplicationStatus.REVIEW_APPROVED).then(() => {
            this.isLoading = false;
            this.onProceed.emit();
        }).catch(err => {
            this.isLoading = false;
            console.error(err);
        })
    }

    closeReviewMode(): void {
        this.applicationReviewData = null;
    }

    proceedToWorkflowActions(): void {
        this.onProceed.emit();
    }

    referBack(): void {
        this.onReferBack.emit();
    }

    private async initializeData() {
        // const res = await this.apiService.api<any[]>("GET", "/application-statuses?page=0&limit=50")
        // console.log("statuses", res)
    }
}