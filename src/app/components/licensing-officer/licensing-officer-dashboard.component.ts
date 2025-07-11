import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { COMMON_MODULES } from '../../custom-material/custom-material.module';
import { WorkflowService } from '../../shared/services/workflow.service';
import { NotificationService } from '../../shared/services/notification.service';
import { WorkflowDashboardComponent } from '../workflow/workflow-dashboard.component';

@Component({
  selector: 'app-licensing-officer-dashboard',
  standalone: true,
  imports: [CommonModule, ...COMMON_MODULES, WorkflowDashboardComponent],
  template: `
    <div class="licensing-officer-dashboard">
      <div class="role-specific-header">
        <h2>📋 Licensing Officer Dashboard</h2>
        <p>Review applications, manage field assessments, and process permit calculations</p>
      </div>
      
      <!-- Quick Actions -->
      <div class="quick-actions">
        <button class="quick-action-btn" (click)="showNewApplications()">
          <div class="action-icon">📝</div>
          <div class="action-text">
            <span class="action-title">New Applications</span>
            <span class="action-count">{{ newApplicationsCount }}</span>
          </div>
        </button>
        
        <button class="quick-action-btn" (click)="showFieldAssessments()">
          <div class="action-icon">🔍</div>
          <div class="action-text">
            <span class="action-title">Field Assessments</span>
            <span class="action-count">{{ fieldAssessmentsCount }}</span>
          </div>
        </button>
        
        <button class="quick-action-btn" (click)="showCalculations()">
          <div class="action-icon">🧮</div>
          <div class="action-text">
            <span class="action-title">Rental Calculations</span>
            <span class="action-count">{{ calculationsCount }}</span>
          </div>
        </button>
      </div>
      
      <!-- Main Workflow Dashboard -->
      <app-workflow-dashboard></app-workflow-dashboard>
      
      <!-- Additional Tools for Licensing Officer -->
      <div class="officer-tools">
        <div class="tool-section">
          <h3>🛠️ Officer Tools</h3>
          <div class="tools-grid">
            <div class="tool-card" (click)="openFieldAssessmentTemplate()">
              <div class="tool-icon">📋</div>
              <h4>Field Assessment Template</h4>
              <p>Download standard assessment forms</p>
            </div>
            
            <div class="tool-card" (click)="openRentalCalculator()">
              <div class="tool-icon">🧮</div>
              <h4>Rental Calculator</h4>
              <p>Calculate annual water usage fees</p>
            </div>
            
            <div class="tool-card" (click)="openApplicationGuidelines()">
              <div class="tool-icon">📖</div>
              <h4>Application Guidelines</h4>
              <p>Review processing guidelines</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './licensing-officer-dashboard.component.scss'
})
export class LicensingOfficerDashboardComponent implements OnInit {

  newApplicationsCount: number = 0;
  fieldAssessmentsCount: number = 0;
  calculationsCount: number = 0;

  constructor(
    private workflowService: WorkflowService,
    private notificationService: NotificationService
  ) {}

  async ngOnInit() {
    await this.loadCounts();
  }

  async loadCounts() {
    try {
      const applications = await this.workflowService.getApplicationsForRole();
      
      this.newApplicationsCount = applications.filter(app => 
        ['submitted', 'pending_review'].includes(app.status?.toLowerCase())
      ).length;
      
      this.fieldAssessmentsCount = applications.filter(app => 
        ['field_assessment_required', 'field_assessment_complete'].includes(app.status?.toLowerCase())
      ).length;
      
      this.calculationsCount = applications.filter(app => 
        app.status?.toLowerCase() === 'pending_calculations'
      ).length;
      
    } catch (error) {
      console.error('Error loading counts:', error);
    }
  }

  showNewApplications() {
    // Filter and highlight new applications
    this.notificationService.info('Filter Applied', 'Showing new applications requiring review');
  }

  showFieldAssessments() {
    // Filter and highlight field assessment applications
    this.notificationService.info('Filter Applied', 'Showing applications requiring field assessment');
  }

  showCalculations() {
    // Filter and highlight calculation applications
    this.notificationService.info('Filter Applied', 'Showing applications requiring rental calculations');
  }

  openFieldAssessmentTemplate() {
    // Download or open field assessment template
    const templateUrl = '/assets/templates/field-assessment-template.pdf';
    window.open(templateUrl, '_blank');
  }

  openRentalCalculator() {
    // Open rental calculator tool
    this.notificationService.info('Tool', 'Rental calculator tool is available in application actions');
  }

  openApplicationGuidelines() {
    // Open application processing guidelines
    const guidelinesUrl = '/assets/documents/application-processing-guidelines.pdf';
    window.open(guidelinesUrl, '_blank');
  }
}