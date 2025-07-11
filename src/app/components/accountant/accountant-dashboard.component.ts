import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { COMMON_MODULES } from '../../custom-material/custom-material.module';
import { WorkflowService } from '../../shared/services/workflow.service';
import { NotificationService } from '../../shared/services/notification.service';
import { WorkflowDashboardComponent } from '../workflow/workflow-dashboard.component';

@Component({
  selector: 'app-accountant-dashboard',
  standalone: true,
  imports: [CommonModule, ...COMMON_MODULES, WorkflowDashboardComponent],
  template: `
    <div class="accountant-dashboard">
      <div class="role-specific-header">
        <h2>💰 Accountant Dashboard</h2>
        <p>Manage invoices, process payments, and track financial transactions</p>
      </div>
      
      <!-- Financial Summary -->
      <div class="financial-summary">
        <div class="summary-card revenue">
          <div class="summary-icon">💵</div>
          <div class="summary-content">
            <h3>Total Revenue</h3>
            <div class="amount">{{ formatCurrency(totalRevenue) }}</div>
            <div class="period">This Month</div>
          </div>
        </div>
        
        <div class="summary-card pending">
          <div class="summary-icon">⏳</div>
          <div class="summary-content">
            <h3>Pending Payments</h3>
            <div class="amount">{{ formatCurrency(pendingPayments) }}</div>
            <div class="period">{{ pendingPaymentsCount }} applications</div>
          </div>
        </div>
        
        <div class="summary-card invoices">
          <div class="summary-icon">🧾</div>
          <div class="summary-content">
            <h3>Invoices Generated</h3>
            <div class="amount">{{ invoicesGenerated }}</div>
            <div class="period">This Month</div>
          </div>
        </div>
      </div>
      
      <!-- Quick Actions -->
      <div class="quick-actions">
        <button class="quick-action-btn generate" (click)="showPendingInvoices()">
          <div class="action-icon">🧾</div>
          <div class="action-text">
            <span class="action-title">Generate Invoices</span>
            <span class="action-count">{{ pendingInvoicesCount }}</span>
          </div>
        </button>
        
        <button class="quick-action-btn verify" (click)="showPaymentVerification()">
          <div class="action-icon">✅</div>
          <div class="action-text">
            <span class="action-title">Verify Payments</span>
            <span class="action-count">{{ pendingVerificationCount }}</span>
          </div>
        </button>
        
        <button class="quick-action-btn reports" (click)="generateFinancialReport()">
          <div class="action-icon">📊</div>
          <div class="action-text">
            <span class="action-title">Financial Reports</span>
            <span class="action-count">Ready</span>
          </div>
        </button>
      </div>
      
      <!-- Main Workflow Dashboard -->
      <app-workflow-dashboard></app-workflow-dashboard>
      
      <!-- Payment Methods Status -->
      <div class="payment-methods-status">
        <h3>💳 Payment Methods Status</h3>
        <div class="methods-grid">
          <div class="method-status" *ngFor="let method of paymentMethods">
            <div class="method-icon" [style.color]="method.color">{{ method.icon }}</div>
            <div class="method-info">
              <h4>{{ method.name }}</h4>
              <p>{{ method.status }}</p>
              <div class="method-stats">
                <span>{{ method.transactions }} transactions</span>
                <span>{{ formatCurrency(method.amount) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Accountant Tools -->
      <div class="accountant-tools">
        <div class="tool-section">
          <h3>🛠️ Financial Tools</h3>
          <div class="tools-grid">
            <div class="tool-card" (click)="openInvoiceTemplate()">
              <div class="tool-icon">📄</div>
              <h4>Invoice Templates</h4>
              <p>Manage invoice templates and formats</p>
            </div>
            
            <div class="tool-card" (click)="openPaymentReconciliation()">
              <div class="tool-icon">🔄</div>
              <h4>Payment Reconciliation</h4>
              <p>Reconcile payments with bank statements</p>
            </div>
            
            <div class="tool-card" (click)="openFinancialReports()">
              <div class="tool-icon">📈</div>
              <h4>Financial Reports</h4>
              <p>Generate comprehensive financial reports</p>
            </div>
            
            <div class="tool-card" (click)="openReceiptManager()">
              <div class="tool-icon">🧾</div>
              <h4>Receipt Manager</h4>
              <p>Manage uploaded payment receipts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './accountant-dashboard.component.scss'
})
export class AccountantDashboardComponent implements OnInit {

  totalRevenue: number = 0;
  pendingPayments: number = 0;
  pendingPaymentsCount: number = 0;
  invoicesGenerated: number = 0;
  pendingInvoicesCount: number = 0;
  pendingVerificationCount: number = 0;

  paymentMethods = [
    {
      name: 'Mobile Money',
      icon: '📱',
      color: '#28a745',
      status: 'Active',
      transactions: 45,
      amount: 225000
    },
    {
      name: 'Bank Transfer',
      icon: '🏦',
      color: '#007bff',
      status: 'Active',
      transactions: 23,
      amount: 450000
    },
    {
      name: 'Cash Deposit',
      icon: '💰',
      color: '#ffc107',
      status: 'Active',
      transactions: 12,
      amount: 60000
    },
    {
      name: 'Cheque Payment',
      icon: '📄',
      color: '#6c757d',
      status: 'Limited',
      transactions: 5,
      amount: 125000
    }
  ];

  constructor(
    private workflowService: WorkflowService,
    private notificationService: NotificationService
  ) {}

  async ngOnInit() {
    await this.loadFinancialData();
  }

  async loadFinancialData() {
    try {
      const applications = await this.workflowService.getApplicationsForRole();
      
      // Calculate financial metrics
      this.pendingInvoicesCount = applications.filter(app => 
        ['approved', 'pending_invoice'].includes(app.status?.toLowerCase())
      ).length;
      
      this.pendingVerificationCount = applications.filter(app => 
        app.paymentStatus?.status === 'VERIFICATION_PENDING'
      ).length;
      
      // Mock financial data - in real app, this would come from API
      this.totalRevenue = 1250000;
      this.pendingPayments = 350000;
      this.pendingPaymentsCount = 15;
      this.invoicesGenerated = 67;
      
    } catch (error) {
      console.error('Error loading financial data:', error);
    }
  }

  formatCurrency(amount: number): string {
    return `MWK ${new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)}`;
  }

  showPendingInvoices() {
    this.notificationService.info('Filter Applied', 'Showing applications requiring invoice generation');
  }

  showPaymentVerification() {
    this.notificationService.info('Filter Applied', 'Showing payments requiring verification');
  }

  generateFinancialReport() {
    this.notificationService.info('Report', 'Generating comprehensive financial report...');
    // In real app, this would trigger report generation
  }

  openInvoiceTemplate() {
    const templateUrl = '/assets/templates/invoice-template.pdf';
    window.open(templateUrl, '_blank');
  }

  openPaymentReconciliation() {
    this.notificationService.info('Tool', 'Payment reconciliation tool opening...');
    // Navigate to reconciliation tool
  }

  openFinancialReports() {
    this.notificationService.info('Reports', 'Financial reports dashboard opening...');
    // Navigate to reports dashboard
  }

  openReceiptManager() {
    this.notificationService.info('Manager', 'Receipt management tool opening...');
    // Navigate to receipt manager
  }
}