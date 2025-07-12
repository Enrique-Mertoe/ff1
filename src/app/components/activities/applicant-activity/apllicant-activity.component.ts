import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';

interface TrackingStep {
    id: number;
    title: string;
    description: string;
    icon: string;
    timestamp: string;
    status: 'completed' | 'current' | 'pending';
    trackingNumber?: string;
}

@Component({
    selector: 'app-order-tracking-progress',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="mx-auto p-2 bg-white">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h1 class="text-2xl font-bold text-gray-900">Track Your Order</h1>
          <div class="flex items-center space-x-2 text-sm text-gray-500">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span>Delivering to New York, NY</span>
          </div>
        </div>
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex items-center space-x-3">
            <div class="bg-blue-500 text-white rounded-full p-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-blue-900">Order #ORD-2024-001234</h3>
              <p class="text-blue-700 text-sm">3 items • Total: $127.99</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Progress Steps -->
      <div class="relative">
        <div *ngFor="let step of trackingSteps; let i = index" class="relative">
          <!-- Connector Line -->
          <div 
            *ngIf="i < trackingSteps.length - 1"
            class="absolute left-6 top-12 w-0.5 h-16"
            [ngClass]="getConnectorColor(i)"
            style="z-index: 1">
          </div>
          
          <!-- Step Content -->
          <div class="flex items-start space-x-4 pb-8">
            <!-- Icon Circle -->
            <div 
              class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
              [ngClass]="getStatusColor(step.status)"
              style="z-index: 2">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  [attr.d]="getIconPath(step.icon)">
                </path>
              </svg>
            </div>
            
            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center space-x-3 mb-1">
                <h3 [ngClass]="getTitleColor(step.status)" class="font-semibold">
                  {{ step.title }}
                </h3>
                <span 
                  *ngIf="step.status === 'current'" 
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  In Progress
                </span>
              </div>
              
              <p class="text-gray-600 text-sm mb-2">{{ step.description }}</p>
              
              <div class="flex items-center justify-between">
                <p class="text-xs text-gray-500">{{ step.timestamp }}</p>
                <div *ngIf="step.trackingNumber" class="text-xs">
                  <span class="text-gray-500">Tracking: </span>
                  <button class="text-blue-600 hover:text-blue-800 font-medium">
                    {{ step.trackingNumber }}
                  </button>
                </div>
              </div>
              
              <!-- Additional Info for Current Step -->
              <div 
                *ngIf="step.status === 'current' && step.id === 4" 
                class="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div class="flex items-center space-x-2 text-sm">
                  <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span class="text-blue-800 font-medium">Out for delivery</span>
                </div>
                <p class="text-blue-700 text-xs mt-1">
                  Your package is with our delivery partner and will arrive today between 2-6 PM
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 class="font-semibold text-gray-900 mb-4">Order Summary</h3>
        <div class="space-y-3">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Wireless Headphones</span>
            <span class="text-gray-900">$79.99</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Phone Case</span>
            <span class="text-gray-900">$24.99</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">USB Cable</span>
            <span class="text-gray-900">$12.99</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Shipping</span>
            <span class="text-gray-900">$9.99</span>
          </div>
          <div class="border-t pt-3">
            <div class="flex justify-between font-semibold">
              <span>Total</span>
              <span>$127.99</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-6 flex space-x-3">
        <button class="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
          Track on Map
        </button>
        <button class="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium">
          Contact Support
        </button>
      </div>

      <!-- Demo Controls -->
      <div class="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 class="font-semibold text-yellow-800 mb-2">Demo Controls</h4>
        <p class="text-yellow-700 text-sm mb-3">Simulate different order stages:</p>
        <div class="flex space-x-2">
          <button
            *ngFor="let step of [1, 2, 3, 4, 5]"
            (click)="setCurrentStep(step)"
            class="px-3 py-1 rounded text-sm font-medium transition-colors"
            [ngClass]="currentStep === step 
              ? 'bg-yellow-600 text-white' 
              : 'bg-white text-yellow-600 border border-yellow-300 hover:bg-yellow-100'">
            Step {{ step }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class OrderTrackingProgressComponent implements OnInit{
    currentStep = 3; // Demo: Currently at "Shipped" stage

    trackingSteps: TrackingStep[] = [
        {
            id: 1,
            title: "Order Placed",
            description: "Your order has been successfully placed and confirmed",
            icon: "shopping-cart",
            timestamp: "Dec 15, 2024 at 2:30 PM",
            status: "completed"
        },
        {
            id: 2,
            title: "Payment Confirmed",
            description: "Payment has been processed and verified",
            icon: "credit-card",
            timestamp: "Dec 15, 2024 at 2:32 PM",
            status: "completed"
        },
        {
            id: 3,
            title: "Processing",
            description: "Your items are being prepared and packaged",
            icon: "package",
            timestamp: "Dec 16, 2024 at 9:15 AM",
            status: "completed"
        },
        {
            id: 4,
            title: "Shipped",
            description: "Your order is on its way to the delivery address",
            icon: "truck",
            timestamp: "Dec 16, 2024 at 4:20 PM",
            status: "current",
            trackingNumber: "TRK123456789"
        },
        {
            id: 5,
            title: "Delivered",
            description: "Your order has been successfully delivered",
            icon: "check-circle",
            timestamp: "Expected: Dec 18, 2024",
            status: "pending"
        }
    ];

    constructor() {
        this.updateStepStatuses();
    }

    ngOnInit(): void {
        // throw new Error('Method not implemented.');
    }

    setCurrentStep(step: number): void {
        this.currentStep = step;
        this.updateStepStatuses();
    }

    private updateStepStatuses(): void {
        this.trackingSteps.forEach(step => {
            if (step.id < this.currentStep) {
                step.status = 'completed';
            } else if (step.id === this.currentStep) {
                step.status = 'current';
            } else {
                step.status = 'pending';
            }
        });
    }

    getStatusColor(status: string): string {
        switch (status) {
            case 'completed':
                return 'bg-green-500 text-white';
            case 'current':
                return 'bg-blue-500 text-white animate-pulse';
            case 'pending':
                return 'bg-gray-200 text-gray-500';
            default:
                return 'bg-gray-200 text-gray-500';
        }
    }

    getTitleColor(status: string): string {
        switch (status) {
            case 'completed':
                return 'text-green-600';
            case 'current':
                return 'text-blue-600';
            case 'pending':
                return 'text-gray-500';
            default:
                return 'text-gray-500';
        }
    }

    getConnectorColor(index: number): string {
        if (index < this.currentStep - 1) return 'bg-green-500';
        if (index === this.currentStep - 1) return 'bg-gradient-to-b from-green-500 to-gray-300';
        return 'bg-gray-300';
    }

    getIconPath(icon: string): string {
        const iconPaths: { [key: string]: string } = {
            'shopping-cart': 'M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L6 5H2m5 8a2 2 0 104 0 2 2 0 00-4 0zm10 0a2 2 0 104 0 2 2 0 00-4 0z',
            'credit-card': 'M2 8h20M2 12h20M8 16h.01M12 16h.01M16 16h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
            'package': 'M12 2l3.09 6.26L22 9l-5 4.99L18.18 22 12 18.77 5.82 22 7 13.99 2 9l6.91-.74L12 2z',
            'truck': 'M16 3h4a2 2 0 012 2v11a2 2 0 01-2 2h-2M16 3a2 2 0 00-2 2v12a2 2 0 002 2h2M16 3L8 3a2 2 0 00-2 2v12a2 2 0 002 2h8M7 19a2 2 0 11-4 0 2 2 0 014 0zM19 19a2 2 0 11-4 0 2 2 0 014 0z',
            'check-circle': 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
        };
        return iconPaths[icon] || iconPaths['check-circle'];
    }
}