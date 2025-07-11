import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Model} from "survey-core";
import {BorderlessLight} from "survey-core/themes";
import {SurveyModule} from "survey-angular-ui";
import {ActivatedRoute, UrlTree} from "@angular/router";
import {CoreLicenseType} from "../../../shared/schema/core-license-type";
import {CoreLicenseTypeService} from "../../../shared/services/core-license-type.service";
import {CanComponentDeactivate} from "../../../shared/guards/can-deactivate.guard";
import {Observable} from "rxjs";
import {NotificationService} from "../../../shared/services/notification.service";
import {
  GROUND_WATER_FORM,
  iconDescriptionHideSvg,
  iconDescriptionShowSvg
} from "../../../shared/schema/form-schema/application-form";
import { SURFACE_WATER_APPLICATION_FORM } from "../../../shared/schema/form-schema/surface_water_form";
import {COMMON_MODULES} from "../../../custom-material/custom-material.module";
import {CoreLicenseRequirementService} from "../../../shared/services/core-license-requirement.service";
import {CoreLicenseApplicationService} from "../../../shared/services/core-license-application.service";
import {CoreWaterSourceService} from "../../../shared/services/core-water-source.service";
import {SurfaceWaterPermitService} from "../../../shared/services/surface-water-permit.service";
import { environment } from "../../../../environments/environment";


const openMap = function () {
  alert("Map opened");
}

@Component({
  selector: 'app-application-form',
  standalone: true,
  imports: [
    SurveyModule,
    ...COMMON_MODULES
  ],
  templateUrl: './application-form.component.html',
  styleUrl: './application-form.component.scss'
})
export class ApplicationFormComponent implements OnInit, CanComponentDeactivate, AfterViewInit {

  surveyModel!: Model;
  licenseType!: CoreLicenseType;
  licenseTypeId: string = "Testing";
  saved = false;
  selectedSchema: any;
  isSubmitting = false;

  constructor(private route: ActivatedRoute, private licenseTypeService: CoreLicenseTypeService,
              private licenseRequirementService: CoreLicenseRequirementService,
              private notificationService: NotificationService,
              private coreLicenseApplicationService: CoreLicenseApplicationService,
              private coreWaterSourceService: CoreWaterSourceService,
              private surfaceWaterPermitService: SurfaceWaterPermitService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.licenseTypeId = this.route.snapshot.params['id'];
    this.route.params.subscribe(res => {
      this.licenseTypeId = res['id'];
    });

    await this.licenseTypeService.getById(this.licenseTypeId).then(res => {
      this.licenseType = res;
    });

    // Select appropriate form schema based on license type
    console.log('=== SELECTING FORM SCHEMA ===');
    console.log('License type name:', this.licenseType.name);
    
    if (this.licenseType.name && this.licenseType.name.toLowerCase().includes('surface water')) {
      this.selectedSchema = SURFACE_WATER_APPLICATION_FORM;
      console.log('Using SURFACE_WATER_APPLICATION_FORM');
    } else {
      this.selectedSchema = GROUND_WATER_FORM;
      console.log('Using GROUND_WATER_FORM');
    }

    this.selectedSchema.title = this.licenseType.name;

    let requirements = "";
    let requirementMaxSize = 0;
    await this.licenseRequirementService.getByLicenseType(this.licenseTypeId).then(res => {
      requirementMaxSize = res.length;
      for(let r of res) {
        requirements += "\n - " + r.description;
      }
    });
    this.selectedSchema['description'] = this.licenseType.description + " " + requirements;

    // Load water sources for step 2
    const waterSources = await this.coreWaterSourceService.getAll();

    const survey = new Model(this.selectedSchema);

    // Add console logs for debugging water source dropdowns
    console.log('=== WATER SOURCE DEBUGGING ===');
    console.log('License Type:', this.licenseType.name);
    console.log('Water Sources loaded:', waterSources?.length || 0);
    console.log('Environment API URL:', environment.apiURL || 'Environment not loaded');

    survey.setVariable("waterSources", waterSources);
    survey.setVariable("licenceTypeId", this.licenseTypeId);
    survey.setVariable("requirementMaxSize", requirementMaxSize);
    survey.setVariable("wApplicationType", this.licenseType.name);

    // Add initial water source types loading
    console.log('=== LOADING INITIAL WATER SOURCE TYPES ===');
    try {
      const response = await fetch(`${environment.apiURL}/water-source-types`);
      console.log('Water source types response status:', response.status);
      
      if (response.ok) {
        const waterSourceTypes = await response.json();
        console.log('Water source types loaded:', waterSourceTypes);
        console.log('Count:', waterSourceTypes?.length || 0);
        
        // Set the water source types in the first dropdown
        const waterSourceTypeQuestion = survey.getQuestionByName('coreWaterSourceType');
        if (waterSourceTypeQuestion) {
          const typeChoices = waterSourceTypes.map((type: any) => ({
            value: type.id,
            text: type.name
          }));
          console.log('Setting water source type choices:', typeChoices);
          // @ts-ignore
          waterSourceTypeQuestion.choices = typeChoices;
        }
      } else {
        console.error('Failed to load water source types:', response.statusText);
      }
    } catch (error) {
      console.error('Error loading water source types:', error);
    }

    // Handle dynamic water source loading - FIXED VERSION
    survey.onValueChanged.add(async (sender, options) => {
      console.log('=== SURVEY VALUE CHANGED - DETAILED ===');
      console.log('Field name:', options.name);
      console.log('New value:', options.value);
      
      if (options.name === 'coreWaterSourceType') {
        console.log('=== WATER SOURCE TYPE CHANGED ===');

        if (options.value) {
          console.log('=== UPDATING WATER SOURCE SELECT ELEMENT ===');
          console.log('Selected water source type:', options.value);

          try {
            console.log('Making API call to get water sources by type...');
            const waterSourcesByType = await this.coreWaterSourceService.getByType(options.value);
            console.log('Raw API response:', waterSourcesByType);
            
            console.log('Formatted choices for dropdown:', waterSourcesByType);
            console.log('Number of choices:', waterSourcesByType.length);

            // Update the HTML select element
            setTimeout(() => {
              console.log('=== SEARCHING FOR HTML SELECT ELEMENT ===');
              console.log('Looking for element with ID: coreWaterSourceSelect');
              console.log('All elements with this ID:', document.querySelectorAll('#coreWaterSourceSelect'));
              console.log('Document ready state:', document.readyState);
              
              const selectElement = document.getElementById('coreWaterSourceSelect') as HTMLSelectElement;
              console.log('Select element found:', !!selectElement);
              console.log('Select element details:', selectElement);
              
              if (selectElement) {
                // Clear existing options
                selectElement.innerHTML = '';
                
                // Add default option
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = '-- Please select a water source --';
                selectElement.appendChild(defaultOption);
                
                // Add water source options
                waterSourcesByType.forEach((source: any) => {
                  const option = document.createElement('option');
                  option.value = source.id;
                  option.textContent = source.name;
                  selectElement.appendChild(option);
                });
                
                // Add event listener for changes
                selectElement.onchange = (event) => {
                  const selectedValue = (event.target as HTMLSelectElement).value;
                  console.log('=== WATER SOURCE SELECTED FROM HTML ===');
                  console.log('Selected water source ID:', selectedValue);
                  
                  // Update the hidden survey field
                  const hiddenQuestion = sender.getQuestionByName('coreWaterSource');
                  if (hiddenQuestion) {
                    hiddenQuestion.value = selectedValue;
                    console.log('Updated hidden field value:', selectedValue);
                  }
                };
                
                console.log('Select element updated with', waterSourcesByType.length, 'options');
                
                if (waterSourcesByType.length === 0) {
                  console.warn('⚠️ NO WATER SOURCES FOUND FOR THIS TYPE');
                  const noDataOption = document.createElement('option');
                  noDataOption.value = '';
                  noDataOption.textContent = 'No water sources available for this type';
                  noDataOption.disabled = true;
                  selectElement.appendChild(noDataOption);
                }
              } else {
                console.error('Could not find select element with ID: coreWaterSourceSelect');
              }
            }, 100);

          } catch (error) {
            console.error('Error loading water sources:', error);
            setTimeout(() => {
              const selectElement = document.getElementById('coreWaterSourceSelect') as HTMLSelectElement;
              if (selectElement) {
                selectElement.innerHTML = '<option value="">Error loading data</option>';
              }
            }, 100);
          }
        } else {
          console.log('Clearing water source choices (no type selected)');
          setTimeout(() => {
            const selectElement = document.getElementById('coreWaterSourceSelect') as HTMLSelectElement;
            if (selectElement) {
              selectElement.innerHTML = '<option value="">-- Please select a water source type first --</option>';
            }
            // Clear hidden field
            const hiddenQuestion = sender.getQuestionByName('coreWaterSource');
            if (hiddenQuestion) {
              hiddenQuestion.clearValue();
            }
          }, 100);
        }
      }
    });

    // Alternative approach using onAfterRenderQuestion for additional UI updates
    survey.onAfterRenderQuestion.add((sender, options) => {
      if (options.question.name === 'coreWaterSource') {
        // @ts-ignore

        console.log('Water source question rendered with choices:', options.question.choices?.length || 0);
      }
    });

    survey.onUploadFiles.add((form, options) => {
      const formData = new FormData();
      options.files.forEach(function (file: any) {
        formData.append(file.name, file);
      });
    });

    survey.onComplete.add(async () => {
      if (this.isSubmitting) {
        console.log('Submission already in progress, ignoring duplicate');
        return;
      }
      
      this.isSubmitting = true;
      survey.mode = 'display';
      
      try {
        const formData = survey.getData();
        const applicationData = {
          ...formData,
          licenseTypeId: this.licenseTypeId,
          license_type_id: this.licenseType?.id || this.licenseTypeId,
          clientName: formData.clientName,
          clientEmail: formData.clientEmail,
          applicantEmail: formData.clientEmail,
          applicantName: formData.clientName,
          applicationDate: new Date().toISOString(),
          status: 'SUBMITTED',
          licenseType: this.licenseType?.name
        };
        
        let submittedApplication;
        if (this.licenseType.name && this.licenseType.name.toLowerCase().includes('surface water')) {
          submittedApplication = await this.surfaceWaterPermitService.applyForPermit(applicationData);
        } else {
          submittedApplication = await this.coreLicenseApplicationService.create(applicationData);
        }
        
        if (submittedApplication && submittedApplication.id) {
          this.showCompletionPage(submittedApplication);
          this.saved = true;
          
          if (submittedApplication.emailTaskId) {
            this.notificationService.info('Sending Email', `Sending invoice to ${submittedApplication.applicantEmail || submittedApplication.clientEmail}...`);
            this.pollEmailStatus(submittedApplication.emailTaskId, submittedApplication);
          }
          
          this.isSubmitting = false;
        } else {
          throw new Error('Application submission failed');
        }
        
      } catch (error) {
        console.error('Error submitting application:', error);
        this.notificationService.error('Error', 'Failed to submit application. Please try again.');
        this.isSubmitting = false;
        survey.mode = 'edit';
      }
    });

    survey.locale = 'en';
    survey.applyTheme(BorderlessLight);
    this.surveyModel = survey;
  }

  canDeactivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.saved) {
      return true;
    }
    return this.notificationService.coreConfirm('Confirm', 'Are you sure you want to leave without saving the data? \n All unsaved changes will be lost')
        .then( async (result: boolean) => {
              return !!result;
            }
        );
  }

  ngAfterViewInit(): void {
    setTimeout(()=> {
      document.querySelectorAll(".open-map").forEach( x => {
        x.addEventListener("click", ()=> {
          openMap();
        });
      });
    }, 100);
  }

  async generateAndSendInvoice(application: any) {
    console.log('=== GENERATING INVOICE ===');
    console.log('Application for invoice:', application);
    
    try {
      // Create invoice data
      const invoiceData = {
        applicationId: application.id,
        applicantName: application.applicantName || application.clientName,
        applicantEmail: application.applicantEmail || application.clientEmail,
        licenseType: this.licenseType.name,
        applicationDate: application.applicationDate,
        feeAmount: 5000.00, // Default fee - should come from backend
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        status: 'PENDING'
      };
      
      console.log('Invoice data:', invoiceData);
      
      // Use the appropriate service method to generate invoice
      let invoice;
      if (this.licenseType.name && this.licenseType.name.toLowerCase().includes('surface water')) {
        invoice = await this.surfaceWaterPermitService.generateInvoice(application.id, invoiceData);
      } else {
        invoice = await this.coreLicenseApplicationService.generateInvoice(application.id, invoiceData);
      }
      console.log('Invoice generated and sent:', invoice);
      this.notificationService.success('Success', `Invoice has been sent to ${invoiceData.applicantEmail}`);
      return invoice;
      
    } catch (error) {
      console.error('Error generating invoice:', error);
      this.notificationService.warn('Warning', 'Application submitted but invoice email failed');
    }
  }

  showCompletionPageWithInvoice(application: any) {
    console.log('=== SHOWING COMPLETION PAGE ===');
    console.log('Application data:', application);
    
    // Use real data from the application response
    const applicantName = application.applicantName || 'N/A';
    const applicantEmail = application.applicantEmail || 'N/A';
    const licenseType = application.licenseType || this.licenseType.name;
    const applicationDate = application.applicationDate ? new Date(application.applicationDate).toLocaleDateString() : new Date().toLocaleDateString();
    const status = application.status || 'SUBMITTED';
    
    const completionHtml = `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #28a745; margin-bottom: 10px;">✅ Application Submitted Successfully!</h2>
          <p style="color: #6c757d;">Application ID: <strong>${application.id}</strong></p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #333; margin-top: 0;">Application Details</h3>
          <p><strong>Applicant:</strong> ${applicantName}</p>
          <p><strong>Email:</strong> ${applicantEmail}</p>
          <p><strong>License Type:</strong> ${licenseType}</p>
          <p><strong>Submitted:</strong> ${applicationDate}</p>
          <p><strong>Status:</strong> <span style="color: #28a745;">${status}</span></p>
        </div>
        
        <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107;">
          <h3 style="color: #856404; margin-top: 0;">📧 Invoice Sent</h3>
          <p style="color: #856404;">
            An invoice has been sent to <strong>${applicantEmail}</strong>
          </p>
          <p style="color: #856404;">
            Please check your email and complete the payment to proceed with your application.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #6c757d;">
            You can view your application status and make payments in the 
            <strong>"My Applications"</strong> section.
          </p>
          <button 
            onclick="window.location.href='/my-applications'" 
            style="background-color: #007bff; color: white; border: none; padding: 12px 24px; border-radius: 4px; cursor: pointer; font-size: 16px; margin-top: 10px;">
            View My Applications
          </button>
        </div>
      </div>
    `;
    
    this.surveyModel.completedHtml = completionHtml;
    this.surveyModel.render();
  }

  showCompletionPage(application: any) {
    const applicantName = application.applicantName || 'N/A';
    const applicantEmail = application.applicantEmail || 'N/A';
    const licenseType = application.licenseType || this.licenseType.name;
    const applicationDate = application.applicationDate ? new Date(application.applicationDate).toLocaleDateString() : new Date().toLocaleDateString();
    const status = application.status || 'SUBMITTED';
    
    const completionHtml = `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #28a745; margin-bottom: 10px;">✅ Application Submitted Successfully!</h2>
          <p style="color: #6c757d;">Application ID: <strong>${application.id}</strong></p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #333; margin-top: 0;">Application Details</h3>
          <p><strong>Applicant:</strong> ${applicantName}</p>
          <p><strong>Email:</strong> ${applicantEmail}</p>
          <p><strong>License Type:</strong> ${licenseType}</p>
          <p><strong>Submitted:</strong> ${applicationDate}</p>
          <p><strong>Status:</strong> <span style="color: #28a745;">${status}</span></p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <button onclick="window.location.href='/my-applications'" 
            style="background-color: #007bff; color: white; border: none; padding: 12px 24px; border-radius: 4px; cursor: pointer; font-size: 16px;">
            View My Applications
          </button>
        </div>
      </div>
    `;
    
    this.surveyModel.completedHtml = completionHtml;
    this.surveyModel.render();
  }

  async pollEmailStatus(emailTaskId: string, application: any) {
    const maxAttempts = 30;
    let attempts = 0;
    const email = application.applicantEmail || application.clientEmail;
    
    const poll = async () => {
      try {
        const response = await fetch(`${environment.apiURL || 'http://localhost:8080/api/nwra-apis/ewaterpermit-ws/v1'}/license-applications/email-status/${emailTaskId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.status === 'SENT') {
          this.notificationService.success('Email Sent', `Invoice has been sent to ${email}. Please check your email.`);
          return;
        } else if (result.status === 'FAILED') {
          this.notificationService.warn('Email Failed', 'Failed to send invoice email.');
          return;
        } else if (attempts < maxAttempts && (result.status === 'SENDING' || result.status === 'PENDING')) {
          attempts++;
          setTimeout(poll, 1000);
        } else {
          this.notificationService.warn('Email Delayed', 'Email sending is taking longer than expected.');
        }
      } catch (error) {
        if (attempts < maxAttempts) {
          attempts++;
          setTimeout(poll, 2000);
        } else {
          this.notificationService.warn('Email Failed', 'Failed to send invoice email.');
        }
      }
    };
    
    poll();
  }



  getTypeId() {
    return this.licenseTypeId;
  }
}