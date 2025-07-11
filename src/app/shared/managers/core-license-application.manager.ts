
import {CoreLicenseType} from "../schema/core-license-type";
import {CoreApplicationStatus} from "../schema/core-application-status";
import {CoreApplicationStep} from "../schema/core-application-step";
import {SysUserAccount} from "../schema/sys-user-account";
import {CoreLicense} from "../schema/core-license";


export interface SysSalutation {
    id: string;
    dateCreated: string;
    dateUpdated: string | null;
    name: string;
    description: string | null;
}

export interface CoreDistrict {
    id: string;
    dateCreated: string;
    dateUpdated: string | null;
    name: string;
    code: string;
    description: string | null;
}


export interface WaterRightsUnit {
    id: string;
    dateCreated: string;
    dateUpdated: string | null;
    name: string;
    code: string;
    description: string | null;
}

// export interface CurrentLicense {
//     id: string;
//     dateCreated: string;
//     dateUpdated: string | null;
//     licenseNumber: string;
//     issueDate: string;
//     expiryDate: string;
//     status: string;
// }

export interface WaterLicenseApplication {
    id: string;
    dateCreated: string;
    dateUpdated: string | null;

    // Destination coordinates and details
    destEasting: number | null;
    destHectarage: number | null;
    destNorthing: number | null;
    destOwnerFullname: string | null;
    destPlotNumber: string | null;
    destTa: string | null;
    destVillage: string | null;
    destLandRegime: string | null;
    destWru: WaterRightsUnit | null;

    // Source coordinates and details
    sourceEasting: number | null;
    sourceHectarage: number | null;
    sourceNorthing: number | null;
    sourceOwnerFullname: string | null;
    sourcePlotNumber: string | null;
    sourceTa: string | null;
    sourceVillage: string | null;
    sourceLandRegime: string | null;
    sourceWru: WaterRightsUnit | null;

    // Application details
    dateSubmitted: string | null;
    existingBoreholeCount: number | null;
    permitDuration: number | null;
    nearbyWaterUtilityBoard: string | null;
    altWaterSource: string | null;
    altOtherWater: string | null;
    coreWaterSource: string | null;

    // Related entities
    coreLicenseType: CoreLicenseType;
    currentLicense: CoreLicense | null;
    coreApplicationStatus: CoreApplicationStatus;
    coreApplicationStep: CoreApplicationStep | null;
    sysUserAccount: SysUserAccount;
}

// ========== MANAGER CLASS ==========

export class LicenseApplicationManager {
    constructor(private application: WaterLicenseApplication) {}

    // ========== BASIC GETTERS ==========

    get id(): string {
        return this.application.id;
    }

    get dateCreated(): Date {
        return new Date(this.application.dateCreated);
    }

    get dateUpdated(): Date | null {
        return this.application.dateUpdated ? new Date(this.application.dateUpdated) : null;
    }

    get dateSubmitted(): Date | null {
        return this.application.dateSubmitted ? new Date(this.application.dateSubmitted) : null;
    }

    get raw(): WaterLicenseApplication {
        return this.application;
    }

    // ========== STATUS AND WORKFLOW ==========

    get currentStatus(): string {
        return this.application.coreApplicationStatus.name;
    }

    get currentStatusDescription(): string | null {
        return this.application.coreApplicationStatus.description;
    }

    get currentStep(): string | null {
        return this.application.coreApplicationStep?.name || null;
    }

    get currentStepDescription(): string | null {
        return this.application.coreApplicationStep?.description || null;
    }

    get currentStepOrder(): number | null {
        return this.application.coreApplicationStep?.sequenceNumber || null;
    }

    get isDraft(): boolean {
        return this.currentStatus.toLowerCase() === 'draft';
    }

    get isSubmitted(): boolean {
        return this.currentStatus.toLowerCase() === 'submitted';
    }

    get isUnderReview(): boolean {
        return this.currentStatus.toLowerCase() === 'under_review';
    }

    get isApproved(): boolean {
        return this.currentStatus.toLowerCase() === 'approved';
    }

    get isRejected(): boolean {
        return this.currentStatus.toLowerCase() === 'rejected';
    }

    get isPending(): boolean {
        return this.currentStatus.toLowerCase() === 'pending';
    }

    get isCompleted(): boolean {
        return this.isApproved;
    }

    get canBeEdited(): boolean {
        return this.isDraft || this.isRejected;
    }

    // ========== LICENSE TYPE INFORMATION ==========

    get licenseType(): string {
        return this.application.coreLicenseType.name;
    }

    get licenseTypeDescription(): string {
        return this.application.coreLicenseType.description;
    }

    get applicationFees(): number {
        return this.application.coreLicenseType.applicationFees;
    }

    get licenseFees(): number {
        return this.application.coreLicenseType.licenseFees;
    }

    get totalFees(): number {
        return this.applicationFees + this.licenseFees;
    }

    get defaultValidityLength(): number {
        return this.application.coreLicenseType.defaultValidityLength;
    }

    get defaultValidityUnit(): string {
        return 'months'; // Assuming months based on the value
    }

    // ========== APPLICANT INFORMATION ==========

    get applicantName(): string {
        const user = this.application.sysUserAccount;
        return `${user.firstName} ${user.middleName || ''} ${user.lastName}`.trim();
    }

    get applicantEmail(): string {
        return this.application.sysUserAccount.emailAddress;
    }

    get applicantPhone(): string | null {
        return this.application.sysUserAccount.phoneNumber;
    }

    get applicantUsername(): string {
        return this.application.sysUserAccount.username;
    }

    get applicantGroup(): string {
        return this.application.sysUserAccount.sysUserGroup.name;
    }

    get applicantInitials(): string {
        const user = this.application.sysUserAccount;
        return (user.firstName[0] + user.lastName[0]).toUpperCase();
    }

    // ========== LOCATION INFORMATION ==========

    get hasSourceLocation(): boolean {
        return !!(this.application.sourceEasting && this.application.sourceNorthing);
    }

    get hasDestinationLocation(): boolean {
        return !!(this.application.destEasting && this.application.destNorthing);
    }

    get sourceCoordinates(): string | null {
        if (!this.hasSourceLocation) return null;
        return `${this.application.sourceEasting}, ${this.application.sourceNorthing}`;
    }

    get destinationCoordinates(): string | null {
        if (!this.hasDestinationLocation) return null;
        return `${this.application.destEasting}, ${this.application.destNorthing}`;
    }

    get sourceAddress(): string {
        const parts = [
            this.application.sourcePlotNumber ? `Plot ${this.application.sourcePlotNumber}` : null,
            this.application.sourceVillage,
            this.application.sourceTa,
        ].filter(Boolean);

        return parts.join(', ') || 'Not specified';
    }

    get destinationAddress(): string {
        const parts = [
            this.application.destPlotNumber ? `Plot ${this.application.destPlotNumber}` : null,
            this.application.destVillage,
            this.application.destTa,
        ].filter(Boolean);

        return parts.join(', ') || 'Not specified';
    }

    get sourceOwner(): string | null {
        return this.application.sourceOwnerFullname;
    }

    get destinationOwner(): string | null {
        return this.application.destOwnerFullname;
    }

    get sourceHectarage(): number | null {
        return this.application.sourceHectarage;
    }

    get destinationHectarage(): number | null {
        return this.application.destHectarage;
    }

    get sourceLandRegime(): string | null {
        return this.application.sourceLandRegime;
    }

    get destinationLandRegime(): string | null {
        return this.application.destLandRegime;
    }

    // ========== WATER SOURCE INFORMATION ==========

    get waterSource(): string | null {
        return this.application.coreWaterSource;
    }

    get alternativeWaterSource(): string | null {
        return this.application.altWaterSource;
    }

    get otherWaterSource(): string | null {
        return this.application.altOtherWater;
    }

    get nearbyWaterUtilityBoard(): string | null {
        return this.application.nearbyWaterUtilityBoard;
    }

    get existingBoreholeCount(): number | null {
        return this.application.existingBoreholeCount;
    }

    get hasExistingBoreholes(): boolean {
        return (this.existingBoreholeCount || 0) > 0;
    }

    // ========== PERMIT INFORMATION ==========

    get permitDuration(): number | null {
        return this.application.permitDuration;
    }

    get permitDurationDisplay(): string {
        if (!this.permitDuration) return 'Not specified';
        return `${this.permitDuration} ${this.permitDuration === 1 ? 'month' : 'months'}`;
    }

    get hasCurrentLicense(): boolean {
        return !!this.application.currentLicense;
    }

    get currentLicenseNumber(): string | null {
        return this.application.currentLicense?.licenseNumber || null;
    }

    get currentLicenseExpiryDate(): Date | null {
        return this.application.currentLicense?.expirationDate
            ? new Date(this.application.currentLicense.expirationDate)
            : null;
    }

    get isCurrentLicenseExpired(): boolean {
        if (!this.currentLicenseExpiryDate) return false;
        return this.currentLicenseExpiryDate < new Date();
    }

    // ========== VALIDATION METHODS ==========

    get completionPercentage(): number {
        const requiredFields = [
            'sourceEasting', 'sourceNorthing', 'destEasting', 'destNorthing',
            'sourceOwnerFullname', 'destOwnerFullname', 'coreWaterSource',
            'permitDuration', 'sourcePlotNumber', 'destPlotNumber'
        ];

        const completedFields = requiredFields.filter(field => {
            const value = this.application[field as keyof WaterLicenseApplication];
            return value !== null && value !== undefined && value !== '';
        });

        return Math.round((completedFields.length / requiredFields.length) * 100);
    }

    get isComplete(): boolean {
        return this.completionPercentage >= 80; // 80% completion threshold
    }

    getMissingRequiredFields(): string[] {
        const requiredFields = [
            { key: 'sourceEasting', label: 'Source Easting Coordinate' },
            { key: 'sourceNorthing', label: 'Source Northing Coordinate' },
            { key: 'destEasting', label: 'Destination Easting Coordinate' },
            { key: 'destNorthing', label: 'Destination Northing Coordinate' },
            { key: 'sourceOwnerFullname', label: 'Source Owner Name' },
            { key: 'destOwnerFullname', label: 'Destination Owner Name' },
            { key: 'coreWaterSource', label: 'Water Source' },
            { key: 'permitDuration', label: 'Permit Duration' },
            { key: 'sourcePlotNumber', label: 'Source Plot Number' },
            { key: 'destPlotNumber', label: 'Destination Plot Number' }
        ];

        return requiredFields
            .filter(field => {
                const value = this.application[field.key as keyof WaterLicenseApplication];
                return value === null || value === undefined || value === '';
            })
            .map(field => field.label);
    }

    // ========== UTILITY METHODS ==========

    get daysFromCreation(): number {
        const now = new Date();
        const created = this.dateCreated;
        return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    }

    get daysFromSubmission(): number | null {
        if (!this.dateSubmitted) return null;
        const now = new Date();
        return Math.floor((now.getTime() - this.dateSubmitted.getTime()) / (1000 * 60 * 60 * 24));
    }

    get ageDescription(): string {
        const days = this.daysFromCreation;
        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
        if (days < 365) return `${Math.floor(days / 30)} months ago`;
        return `${Math.floor(days / 365)} years ago`;
    }

    get processingTimeDescription(): string | null {
        const days = this.daysFromSubmission;
        if (days === null) return null;
        if (days === 0) return 'Submitted today';
        if (days === 1) return 'Submitted yesterday';
        if (days < 7) return `Submitted ${days} days ago`;
        if (days < 30) return `Submitted ${Math.floor(days / 7)} weeks ago`;
        return `Submitted ${Math.floor(days / 30)} months ago`;
    }

    // ========== DISPLAY METHODS ==========

    getSummaryText(): string {
        const type = this.licenseType;
        const source = this.sourceAddress;
        const applicant = this.applicantName;
        return `${type} application by ${applicant} for ${source}`;
    }

    getStatusBadgeClass(): string {
        switch (this.currentStatus.toLowerCase()) {
            case 'draft': return 'bg-gray-100 text-gray-800';
            case 'submitted': return 'bg-blue-100 text-blue-800';
            case 'under_review': return 'bg-yellow-100 text-yellow-800';
            case 'approved': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'pending': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }

    getCompletionBadgeClass(): string {
        const percentage = this.completionPercentage;
        if (percentage >= 80) return 'bg-green-100 text-green-800';
        if (percentage >= 60) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    }

    // ========== BUSINESS LOGIC METHODS ==========

    canSubmit(): boolean {
        return this.isDraft && this.isComplete;
    }

    canApprove(): boolean {
        return this.isSubmitted || this.isUnderReview;
    }

    canReject(): boolean {
        return this.isSubmitted || this.isUnderReview;
    }

    canWithdraw(): boolean {
        return this.isSubmitted && !this.isUnderReview;
    }

    needsPayment(): boolean {
        return this.totalFees > 0 && !this.isApproved;
    }

    // ========== COMPARISON METHODS ==========

    isSameLocation(): boolean {
        return this.sourceCoordinates === this.destinationCoordinates;
    }

    isSameOwner(): boolean {
        return this.sourceOwner === this.destinationOwner;
    }

    // ========== EXPORT METHODS ==========

    toSummaryObject(): any {
        return {
            id: this.id,
            applicantName: this.applicantName,
            applicantEmail: this.applicantEmail,
            licenseType: this.licenseType,
            status: this.currentStatus,
            currentStep: this.currentStep,
            sourceAddress: this.sourceAddress,
            destinationAddress: this.destinationAddress,
            waterSource: this.waterSource,
            completionPercentage: this.completionPercentage,
            dateCreated: this.dateCreated,
            dateSubmitted: this.dateSubmitted,
            totalFees: this.totalFees,
            ageDescription: this.ageDescription,
            processingTimeDescription: this.processingTimeDescription
        };
    }
}