import {Component, Inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {NotificationService} from '../../../shared/services/notification.service';
import {ApiService} from '../../../shared/services/api.service';
import {AuthService} from '../../../shared/services/auth.service';
import {CoreLicenseApplicationService} from "../../../shared/services/core-license-application.service";
import {SysUserAccountManager} from "../../../shared/managers/user.manager";
import {CoreApplicationStep} from "../../../shared/schema/core-application-step";
import {CoreLicenseApplication} from "../../../shared/schema/core-license-application";
import {ReviewComponent} from "./review.component";
import {ApproveAssessmentComponent} from "./approve-assessment.component";

@Component({
    selector: 'app-application-details-dialog',
    standalone: true,
    imports: [CommonModule, FormsModule, MatButton, MatIconModule, ReviewComponent, MatIcon, ApproveAssessmentComponent],
    templateUrl: './application-details-dialog.component.html',
    styleUrls: ['./application-details-dialog.component.scss', './error-overlay.scss']
})
export class ApplicationDetailsDialogComponent implements OnInit {

    selectedApplication: any;
    step: CoreApplicationStep;
    currentApplicationIndex: number = 0;
    filteredApplications: any[] = [];
    showSidePanel: boolean = false;
    licenseOfficerComment: string = '';
    selectedFile: File | null = null;
    predefinedComments: string[] = [];
    commentSuggestions: string[] = [];
    selectedAction: string = 'review';
    backAction: string = '';
    referBack: boolean = false; // previous approver to refer back to
    referBackTargetStepId: string = ''; // target step ID for refer back
    availableSteps: any[] = []; // available previous steps
    currentUserRole: string = ''; // current logged in user role
    applicationActivities: any[] = []; // activity history
    loadingActivities: boolean = false;
    nextSteps: any[] = []; // upcoming workflow steps
    applicationDocuments: any[] = [];
    showReviewMode: boolean = false;
    applicationReviewData: any = null;
    fieldValidationResults: any = {};
    loadingReview: boolean = false;
    showWorkflowActions: boolean = false;
    workflowError: string = '';

    user: SysUserAccountManager


    constructor(
        public dialogRef: MatDialogRef<ApplicationDetailsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private notificationService: NotificationService,
        private apiService: ApiService,
        private authService: AuthService,
        private applicationService: CoreLicenseApplicationService,
    ) {
        this.selectedApplication = data.selectedApplication;
        this.currentApplicationIndex = data.currentApplicationIndex;
        this.filteredApplications = data.filteredApplications;
    }

    async ngOnInit() {
        this.loadPredefinedComments();
        await this.loadCurrentStep();
        await this.loadAvailableSteps();
        await this.loadCurrentUserRole();
        await this.loadApplicationActivities();
        await this.loadNextSteps();
        await this.loadApplicationDocuments();
    }

    async loadCurrentStep() {
        if (this.selectedApplication?.id) {
            try {
                this.step = await this.applicationService.getApplicationStep(this.selectedApplication?.step);
            } catch (error) {
                console.error('Error loading available steps:', error);
            }
        }
    }

    async loadAvailableSteps() {
        if (this.selectedApplication?.id) {
            try {
                const response = await this.apiService.get<any>(`/workflow/available-steps/${this.selectedApplication.id}`);
                this.availableSteps = response.availableSteps || [];
            } catch (error) {
                console.error('Error loading available steps:', error);
            }
        }
    }

    closeDialog() {
        this.dialogRef.close();
    }

    navigateApplication(direction: 'next' | 'prev') {
        if (direction === 'next' && this.currentApplicationIndex < this.filteredApplications.length - 1) {
            this.currentApplicationIndex++;
        } else if (direction === 'prev' && this.currentApplicationIndex > 0) {
            this.currentApplicationIndex--;
        }
        this.selectedApplication = this.filteredApplications[this.currentApplicationIndex];
    }

    canNavigateNext(): boolean {
        return this.currentApplicationIndex < this.filteredApplications.length - 1;
    }

    canNavigatePrev(): boolean {
        return this.currentApplicationIndex > 0;
    }

    openLicenseOfficerActions() {
        this.showSidePanel = true;
    }

    closeSidePanel() {
        setTimeout(() => {
            this.selectedAction = this.backAction || ''
        }, 200)
        this.showSidePanel = false;
    }

    onFileSelected(event: any) {
        this.selectedFile = event.target.files[0] || null;
    }

    loadPredefinedComments() {
        const stored = localStorage.getItem('licenseOfficerComments');
        this.predefinedComments = stored ? JSON.parse(stored) : [];
        this.updateCommentSuggestions();
    }

    updateCommentSuggestions() {
        const input = this.licenseOfficerComment.toLowerCase();
        if (input.length > 2) {
            this.commentSuggestions = this.predefinedComments.filter(comment =>
                comment.toLowerCase().includes(input)
            );
        } else {
            this.commentSuggestions = [];
        }
    }

    selectSuggestion(suggestion: string) {
        this.licenseOfficerComment = suggestion;
        this.commentSuggestions = [];
    }

    saveCommentForFuture() {
        if (this.licenseOfficerComment.trim() && !this.predefinedComments.includes(this.licenseOfficerComment.trim())) {
            this.predefinedComments.push(this.licenseOfficerComment.trim());
            localStorage.setItem('licenseOfficerComments', JSON.stringify(this.predefinedComments));
            this.notificationService.success('Saved', 'Comment saved for future use');
        }
    }

    getCommentPlaceholder(): string {
        switch (this.selectedAction) {
            case 'approve':
                return 'Enter approval comments (optional)...';
            case 'refer_back':
                return 'Specify what clarification is needed...';
            case 'reject':
                return 'Provide reason for rejection...';
            default:
                return 'Enter your comments...';
        }
    }

    async submitWorkflowAction() {
        // Validation
        if (this.referBack && !this.licenseOfficerComment.trim()) {
            this.notificationService.error('Error', `Please provide ${this.selectedAction === 'refer_back' ? 'clarification details' : 'rejection reason'}`);
            return;
        }

        if (this.referBack && !this.referBackTargetStepId) {
            this.notificationService.error('Error', 'Please select the step to refer back to');
            return;
        }

        // Save comment for future use
        if (this.licenseOfficerComment.trim()) {
            this.saveCommentForFuture();
        }

        try {
            const actionData = {
                applicationId: this.selectedApplication?.id,
                action: this.selectedAction,
                comment: this.licenseOfficerComment,
                targetStepId: this.referBackTargetStepId,
                hasDocument: !!this.selectedFile,
                fileName: this.selectedFile?.name
            };

            if (this.referBack)
                return await this.referBackApplication(actionData);

            // Call the appropriate API based on action
            switch (this.selectedAction) {
                case 'approve':
                case 'review_documents':
                case 'recommend_field_assessment':
                case 'upload_field_results':
                case 'calculate_rentals':
                case 'schedule_approval':
                case 'approve_field_assessment':
                case 'check_schedule':
                case 'forward_to_drs':
                case 'authorize_schedule':
                case 'board_approval':
                case 'prepare_invoice':
                    await this.approveApplication(actionData);
                    break;
                case 'refer_back':
                    await this.referBackApplication(actionData);
                    break;
                case 'reject':
                    await this.rejectApplication(actionData);
                    break;
                default:
                    // Handle any custom role-specific actions that need special handling
                    await this.handleRoleSpecificAction(actionData);
                    break;
            }

        } catch (error) {
            console.error('Error submitting workflow action:', error);
            this.notificationService.error('Error', 'Failed to submit workflow action');
        }
    }

    async approveApplication(actionData: any) {
        try {
            let response;

            if (this.selectedFile) {
                // Use multipart form data when file is uploaded
                const formData = new FormData();
                formData.append('license_application_id', actionData.applicationId);
                formData.append('notes', actionData.comment || '');
                formData.append('document', this.selectedFile);

                response = await this.apiService.postFormData('/workflow/confirm-document', formData);
            } else {
                // Use JSON when no file is uploaded
                response = await this.apiService.post(`/workflow/confirm-document`, {
                    license_application_id: actionData.applicationId,
                    notes: actionData.comment,
                    documentUrl: null
                });
            }

            this.notificationService.success('Success', 'Document confirmed and application forwarded to next stage');
            this.closeSidePanel();
            this.dialogRef.close({action: 'approved', data: actionData});
        } catch (error: any) {
            console.error('Error confirming document:', error);
            const errorMessage = error.error?.error || 'Failed to confirm document';

            // Show workflow configuration errors in overlay
            if (errorMessage.includes('No steps found for license type') ||
                errorMessage.includes('workflow') ||
                errorMessage.includes('configuration')) {
                this.workflowError = errorMessage;
            } else {
                this.notificationService.error('Error', errorMessage);
            }
        }
    }

    async referBackApplication(actionData: any) {
        try {
            await this.apiService.post(`/workflow/refer-back/${actionData.applicationId}`, {
                comment: actionData.comment,
                targetStepId: actionData.targetStepId
            });

            const targetStep = this.availableSteps.find(step => step.id === actionData.targetStepId);
            const stepName = targetStep ? targetStep.name : 'previous step';

            this.notificationService.info('Referred', `Application referred back to ${stepName} for clarification`);
            this.closeSidePanel();
            this.dialogRef.close({action: 'referred_back', data: actionData});
        } catch (error: any) {
            console.error('Error referring back application:', error);
            this.notificationService.error('Error', error.error?.error || 'Failed to refer back application');
        }
    }

    trackByValue(_index: number, item: any) {
        return item.value;
    }

    async rejectApplication(actionData: any) {
        try {
            // const response = await this.apiService.post(`/v1/workflow/reject/${actionData.applicationId}`, {
            //   comment: actionData.comment
            // });

            this.notificationService.error('Rejected', 'Application has been rejected');
            this.closeSidePanel();
            this.dialogRef.close({action: 'rejected', data: actionData});
        } catch (error: any) {
            console.error('Error rejecting application:', error);
            this.notificationService.error('Error', error.error?.error || 'Failed to reject application');
        }
    }

    // Keep the old method for backward compatibility
    async submitLicenseOfficerAction() {
        await this.submitWorkflowAction();
    }

    getStatusColor(status: string): string {
        switch (status?.toLowerCase()) {
            case 'submitted':
                return '#28a745';
            case 'under_review':
                return '#ffc107';
            case 'approved':
                return '#007bff';
            case 'rejected':
                return '#dc3545';
            case 'paid':
                return '#28a745';
            case 'pending':
                return '#6c757d';
            default:
                return '#6c757d';
        }
    }

    getPaymentStatusColor(status: string): string {
        switch (status?.toLowerCase()) {
            case 'completed':
            case 'paid':
                return '#28a745';
            case 'pending':
                return '#ffc107';
            case 'failed':
                return '#dc3545';
            default:
                return '#6c757d';
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

    async loadCurrentUserRole() {
        try {
            const user = this.authService.getCurrentUser();
            this.currentUserRole = user?.sysUserGroup?.name?.toLowerCase() || '';
            this.user = new SysUserAccountManager(user)

            // Set default action based on role
            const actions = this.getRoleBasedActions();
            if (actions.length > 0) {
                this.selectedAction = actions[0].value;
            }
        } catch (error) {
            console.error('Error loading current user role:', error);
        }
    }

    getRoleBasedActions(): any[] {
        const role = this.currentUserRole;
        const isStep = (num: number) => {
            return this.step?.sequenceNumber !== num
        }

        switch (role) {
            case 'licensing_officer':
                return [
                    {
                        value: 'review',
                        icon: '🔍',
                        label: 'Recommend Field Assessment',
                        disabled: isStep(0)
                    },
                    {
                        value: 'upload_field_results',
                        icon: '📤',
                        label: 'Upload Field Assessment Results',
                        disabled: isStep(1)
                    },
                    {value: 'calculate_rentals', icon: '💰', label: 'Calculate Annual Rentals', disabled: isStep(1)},
                    {value: 'schedule_approval', icon: '📅', label: 'Schedule for Approval', disabled: isStep(1)},
                    {value: 'refer_back', icon: '⬅️', label: 'Refer Back for Clarification', disabled: false},
                    {value: 'reject', icon: '❌', label: 'Reject Application', disabled: false}
                ];

            case 'licensing_manager':
                return [
                    {
                        value: 'approve_field_assessment',
                        icon: '✅',
                        label: 'Approve Field Assessment',
                        disabled: isStep(2)
                    },
                    {value: 'check_schedule', icon: '🗓️', label: 'Check Recommended Applications', disabled: isStep(2)},
                    {value: 'forward_to_drs', icon: '➡️', label: 'Forward to DRS', disabled: isStep(3)},
                    {value: 'refer_back', icon: '⬅️', label: 'Refer Back to Licensing Officer', disabled: true},
                    {value: 'reject', icon: '❌', label: 'Reject Application', disabled: true}
                ];

            case 'drs':
                return [
                    {value: 'authorize_schedule', icon: '🔐', label: 'Authorize Schedule for CEO', disabled: true},
                    {value: 'refer_back', icon: '⬅️', label: 'Refer Back for Revision', disabled: true},
                    {value: 'reject', icon: '❌', label: 'Reject Application', disabled: true}
                ];

            case 'ceo':
                return [
                    {value: 'board_approval', icon: '👑', label: 'Update Board Approval Status', disabled: true},
                    {value: 'refer_back', icon: '⬅️', label: 'Refer Back for Revision', disabled: true},
                    {value: 'reject', icon: '❌', label: 'Reject Application', disabled: true}
                ];

            case 'accountant':
                return [
                    {value: 'prepare_invoice', icon: '🧾', label: 'Prepare Invoice', disabled: true},
                    {value: 'refer_back', icon: '⬅️', label: 'Refer Back for Correction', disabled: true}
                ];

            default:
                // Generic actions for unknown roles
                return [
                    {value: 'approve', icon: '✅', label: 'Approve & Forward', disabled: true},
                    {value: 'refer_back', icon: '⬅️', label: 'Refer Back for Clarification', disabled: true},
                    {value: 'reject', icon: '❌', label: 'Reject Application', disabled: true}
                ];
        }
    }

    getCommentLabel(): string {
        const action = this.selectedAction;

        switch (action) {
            case 'review_documents':
                return 'Document Review Comments:';
            case 'recommend_field_assessment':
                return 'Field Assessment Recommendations:';
            case 'upload_field_results':
                return 'Field Assessment Results:';
            case 'calculate_rentals':
                return 'Rental Calculation Notes:';
            case 'schedule_approval':
                return 'Scheduling Notes:';
            case 'approve_field_assessment':
                return 'Field Assessment Approval Notes:';
            case 'check_schedule':
                return 'Schedule Review Comments:';
            case 'forward_to_drs':
                return 'Forwarding Notes:';
            case 'authorize_schedule':
                return 'Authorization Comments:';
            case 'board_approval':
                return 'Board Minutes and Approval Details:';
            case 'prepare_invoice':
                return 'Invoice Preparation Notes:';
            case 'refer_back':
                return 'Clarification Required:';
            case 'reject':
                return 'Rejection Reason:';
            case 'approve':
                return 'Approval Comments:';
            default:
                return 'Comments:';
        }
    }

    getActionButtonText(): string {
        const action = this.getRoleBasedActions().find(a => a.value === this.selectedAction);
        return action ? `${action.icon} ${action.label}` : 'Submit Action';
    }

    getActionButtonClass(): string {
        switch (this.selectedAction) {
            case 'reject':
                return 'primary-btn reject-btn';
            case 'refer_back':
                return 'primary-btn refer-btn';
            case 'approve':
            case 'review_documents':
            case 'recommend_field_assessment':
            case 'upload_field_results':
            case 'calculate_rentals':
            case 'schedule_approval':
            case 'approve_field_assessment':
            case 'check_schedule':
            case 'forward_to_drs':
            case 'authorize_schedule':
            case 'board_approval':
            case 'prepare_invoice':
                return 'primary-btn approve-btn';
            default:
                return 'primary-btn';
        }
    }

    getRoleActionButtonText(): string {
        switch (this.currentUserRole) {
            case 'licensing_officer':
                return 'Licensing Officer Actions';
            case 'licensing_manager':
                return 'Licensing Manager Actions';
            case 'license_manager':
                return 'License Manager Actions';
            case 'drs':
                return 'DRS Actions';
            case 'ceo':
                return 'CEO Actions';
            case 'accountant':
                return 'Accountant Actions';
            default:
                return 'Workflow Actions';
        }
    }

    async handleRoleSpecificAction(actionData: any) {
        // Handle any role-specific actions that need special processing
        try {
            // For now, just treat as a standard approval workflow
            // In future, specific actions like upload_field_results could have custom handling
            await this.approveApplication(actionData);
        } catch (error) {
            console.error('Error handling role-specific action:', error);
            this.notificationService.error('Error', 'Failed to process action');
        }
    }

    // Activity History Methods
    async loadApplicationActivities() {
        if (!this.selectedApplication?.id) return;

        this.loadingActivities = true;
        try {
            const response = await this.apiService.get<any>(`/workflow/activities/${this.selectedApplication.id}`);
            this.applicationActivities = response.activities || [];
            // Sort by most recent first
            this.applicationActivities.sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime());
        } catch (error) {
            console.error('Error loading application activities:', error);
            this.applicationActivities = [];
        } finally {
            this.loadingActivities = false;
        }
    }

    async loadNextSteps() {
        if (!this.selectedApplication?.id || !this.step) return;

        try {
            const response = await this.apiService.get<any>(`/workflow/next-steps/${this.selectedApplication.id}`);
            this.nextSteps = response.nextSteps || [];
        } catch (error) {
            console.error('Error loading next steps:', error);
            this.nextSteps = [];
        }
    }

    async loadApplicationDocuments() {
        if (!this.selectedApplication?.id) return;

        try {
            const response = await this.apiService.get<any>(`/application-documents/${this.selectedApplication.id}`);
            this.applicationDocuments = response.documents || [];
        } catch (error) {
            console.error('Error loading application documents:', error);
            this.applicationDocuments = [];
        }
    }

    trackByActivityId(index: number, activity: any): any {
        return activity.id || index;
    }

    getActivityIcon(activityType: string): string {
        switch (activityType?.toUpperCase()) {
            case 'APPROVE':
                return '✅';
            case 'REJECT':
                return '❌';
            case 'REFER_BACK':
                return '⬅️';
            case 'SUBMIT':
                return '📤';
            case 'REVIEW':
                return '👀';
            case 'UPLOAD':
                return '📁';
            case 'CALCULATE':
                return '💰';
            case 'SCHEDULE':
                return '📅';
            default:
                return '📝';
        }
    }

    getActivityClass(activity: any): string {
        const baseClass = 'activity-item';
        const activityType = activity.activity?.toUpperCase();

        switch (activityType) {
            case 'APPROVE':
                return `${baseClass} activity-approve`;
            case 'REJECT':
                return `${baseClass} activity-reject`;
            case 'REFER_BACK':
                return `${baseClass} activity-refer-back`;
            default:
                return `${baseClass} activity-default`;
        }
    }

    isReferredBack(activity: any): boolean {
        return activity.activity?.toUpperCase() === 'REFER_BACK';
    }

    isCurrentUserTarget(activity: any): boolean {
        // Check if this refer-back is targeting the current user's role
        const description = activity.description?.toLowerCase() || '';
        const currentRole = this.currentUserRole.toLowerCase();
        return description.includes(currentRole) || description.includes('your role');
    }

    // Step Status Methods
    getStepStatusClass(): string {
        if (!this.step) return 'step-status-unknown';

        const status = this.selectedApplication?.status?.toLowerCase();
        switch (status) {
            case 'approved':
                return 'step-status-completed';
            case 'rejected':
                return 'step-status-rejected';
            case 'under_review':
                return 'step-status-active';
            case 'pending':
                return 'step-status-pending';
            default:
                return 'step-status-active';
        }
    }

    getStepStatusText(): string {
        const status = this.selectedApplication?.status?.toLowerCase();
        switch (status) {
            case 'approved':
                return 'Completed';
            case 'rejected':
                return 'Rejected';
            case 'under_review':
                return 'In Progress';
            case 'pending':
                return 'Pending';
            default:
                return 'Active';
        }
    }

    getRoleDisplayName(): string {
        if (!this.step) return 'Unknown';

        // Map step sequence to role names based on workflow
        switch (this.step.sequenceNumber) {
            case 0:
                return 'Licensing Officer';
            case 1:
                return 'Licensing Manager';
            case 2:
                return 'License Manager';
            case 3:
                return 'DRS';
            case 4:
                return 'CEO';
            case 5:
                return 'Accountant';
            default:
                return 'System';
        }
    }

    // Document Status Methods
    getDocumentStatusClass(doc: any): string {
        const status = doc.status?.toLowerCase();
        switch (status) {
            case 'approved':
                return 'doc-status-approved';
            case 'pending':
                return 'doc-status-pending';
            case 'rejected':
                return 'doc-status-rejected';
            case 'paid':
                return 'doc-status-approved';
            case 'uploaded':
                return 'doc-status-pending';
            default:
                return 'doc-status-pending';
        }
    }

    getDocumentStatusText(doc: any): string {
        const status = doc.status?.toLowerCase();
        switch (status) {
            case 'approved':
                return '✅ Approved';
            case 'pending':
                return '⏳ Pending Review';
            case 'rejected':
                return '❌ Rejected';
            case 'paid':
                return '✅ Paid';
            case 'uploaded':
                return '📁 Uploaded';
            default:
                return '📄 Available';
        }
    }

    getStepHandler(step: any): string {
        // Map step sequence to handler role
        switch (step.sequenceNumber) {
            case 0:
                return 'Licensing Officer';
            case 1:
                return 'Licensing Manager';
            case 2:
                return 'License Manager';
            case 3:
                return 'DRS';
            case 4:
                return 'CEO';
            case 5:
                return 'Accountant';
            default:
                return 'System';
        }
    }

    // Application Review Methods
    async startApplicationReview() {
        try {
            this.loadingReview = true;
            this.showReviewMode = true;

            this.notificationService.success('Review Started', 'Application loaded for detailed review');
        } catch (error) {
            console.error('Error starting application review:', error);
            this.notificationService.error('Error', 'Failed to load application for review');
        } finally {
            this.loadingReview = false;
        }
    }


    closeReviewMode() {
        this.showReviewMode = false;
        this.applicationReviewData = null;
        this.fieldValidationResults = {};
    }

    handleProceed(referBack: boolean = false) {
        this.referBack = referBack
        this.backAction = this.selectedAction
        this.selectedAction = "finalise"
        this.showWorkflowActions = true
    }

    clearWorkflowError() {
        this.workflowError = '';
    }

    contactAdmin() {
        this.notificationService.info('Contact Admin', 'Please contact your system administrator to configure workflow steps for this license type.');
        this.clearWorkflowError();
    }
}