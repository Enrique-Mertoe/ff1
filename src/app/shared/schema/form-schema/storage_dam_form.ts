import {environment} from "../../../../environments/environment";

    const damClasses = [
      { value: "verySmall", text: "Very Small (0-4.5m height, <500,000m³)" },
      { value: "small", text: "Small (4.5-8.0m height, <1,000,000m³)" },
      { value: "medium", text: "Medium (8.0-15.0m height, <5,000,000m³)" },
      { value: "large", text: "Large (>15m height, >5,000,000m³)" }
    ];

    export const STORAGE_DAM_FORM = {
      title: "DETAILS FOR STORAGE DAMS",
      description: "Water Resources Regulations, 2018 - FORM E",
      logoPosition: "right",
      pages: [
        {
          name: "basicInformation",
          elements: [
            {
              type: "text",
              name: "damName",
              title: "Name of Dam",
              isRequired: true
            },
            {
              type: "text",
              name: "location",
              title: "Location (GPS Coordinates)",
              isRequired: true
            },
            {
              type: "text",
              name: "ownerName",
              title: "Owner/Operator Name",
              isRequired: true
            },
            {
              type: "dropdown",
              name: "damClass",
              title: "Classification of Dam",
              isRequired: true,
              choices: damClasses,
              optionsCaption: "Select dam class..."
            }
          ]
        },
        {
          name: "technicalDetails",
          elements: [
            {
              type: "panel",
              name: "dimensionsPanel",
              title: "Dam Dimensions",
              elements: [
                {
                  type: "text",
                  name: "height",
                  title: "Height (meters)",
                  inputType: "number",
                  isRequired: true
                },
                {
                  type: "text",
                  name: "capacity",
                  title: "Capacity (m³)",
                  inputType: "number",
                  isRequired: true
                },
                {
                  type: "text",
                  name: "length",
                  title: "Length (meters)",
                  inputType: "number"
                },
                {
                  type: "text",
                  name: "width",
                  title: "Width at base (meters)",
                  inputType: "number"
                }
              ]
            },
            {
              type: "panel",
              name: "designPanel",
              title: "Design and Supervision",
              elements: [
                {
                  type: "text",
                  name: "designProfessional",
                  title: "Name of Design Professional",
                  isRequired: true
                },
                {
                  type: "dropdown",
                  name: "professionalCategory",
                  title: "Category of Qualified Professional",
                  isRequired: true,
                  choices: [
                    "Water Engineer",
                    "Registered Civil Engineer",
                    "Professional Dam Experts"
                  ]
                },
                {
                  type: "text",
                  name: "contractor",
                  title: "Name of Dam Contractor",
                  isRequired: true
                },
                {
                  type: "text",
                  name: "contractorCategory",
                  title: "Category of Dam Contractor",
                  isRequired: true,
                  readOnly: true,
                  visibleIf: "{damClass} notempty",
                  defaultValue: function() {
                    const damClass = this.getSurvey().getValue("damClass");
                    switch(damClass) {
                      case "verySmall": return "15 Million Kwacha";
                      case "small": return "50 Million Kwacha";
                      case "medium": return "Unlimited";
                      case "large": return "Unlimited";
                      default: return "";
                    }
                  }
                }
              ]
            }
          ]
        },
        {
          name: "safetyInspection",
          elements: [
            {
              type: "panel",
              name: "inspectionPanel",
              title: "Dam Safety Inspection",
              elements: [
                {
                  type: "text",
                  name: "lastInspectionDate",
                  title: "Date of Last Inspection",
                  inputType: "date",
                  isRequired: true
                },
                {
                  type: "text",
                  name: "nextInspectionDate",
                  title: "Scheduled Next Inspection",
                  inputType: "date",
                  readOnly: true,
                  visibleIf: "{damClass} notempty",
                  defaultValue: function() {
                    const damClass = this.getSurvey().getValue("damClass");
                    const lastDate = new Date(this.getSurvey().getValue("lastInspectionDate"));
                    if (!lastDate) return "";

                    let yearsToAdd = 5;
                    switch(damClass) {
                      case "small": yearsToAdd = 3; break;
                      case "medium": yearsToAdd = 2; break;
                      case "large": yearsToAdd = 1; break;
                    }

                    const nextDate = new Date(lastDate);
                    nextDate.setFullYear(nextDate.getFullYear() + yearsToAdd);
                    return nextDate.toISOString().split('T')[0];
                  }
                },
                {
                  type: "text",
                  name: "inspectionBy",
                  title: "Inspection Conducted By",
                  readOnly: true,
                  visibleIf: "{damClass} notempty",
                  defaultValue: function() {
                    const damClass = this.getSurvey().getValue("damClass");
                    switch(damClass) {
                      case "verySmall": return "Water Engineer";
                      case "small": return "Registered Civil Engineer";
                      case "medium": return "Professional Engineer";
                      case "large": return "Professional Engineer";
                      default: return "";
                    }
                  }
                },
                {
                  type: "text",
                  name: "spillwayDesign",
                  title: "Minimum Spillway Design Flood",
                  readOnly: true,
                  visibleIf: "{damClass} notempty",
                  defaultValue: function() {
                    const damClass = this.getSurvey().getValue("damClass");
                    switch(damClass) {
                      case "verySmall": return "1 in 20 years";
                      case "small": return "1 in 500 years";
                      case "medium": return "1 in 1000 years";
                      case "large": return "1 in 10,000 years";
                      default: return "";
                    }
                  }
                }
              ]
            }
          ]
        },
        {
          name: "documentation",
          elements: [
            {
              type: "file",
              name: "designDocuments",
              title: "Upload Design Documents",
              storeDataAsText: false,
              allowMultiple: true,
              acceptedTypes: ".pdf,.doc,.docx",
              maxSize: 102400
            },
            {
              type: "file",
              name: "inspectionReports",
              title: "Upload Inspection Reports",
              storeDataAsText: false,
              allowMultiple: true,
              acceptedTypes: ".pdf,.doc,.docx",
              maxSize: 102400
            },
            {
              type: "signaturepad",
              name: "engineerSignature",
              title: "Engineer's Signature",
              isRequired: true
            },
            {
              type: "text",
              name: "submissionDate",
              title: "Date of Submission",
              inputType: "date",
              isRequired: true
            }
          ]
        }
      ],
      showQuestionNumbers: "off",
      questionErrorLocation: "bottom",
      completeText: "Submit Dam Details",
      widthMode: "responsive",
      showNavigationButtons: "both",
      completedHtml: "<h3>Thank you for submitting your dam details</h3><p>The information will be reviewed by the National Water Resources Authority.</p>"
    };

    /*const survey = new Survey.Model(surveyJson);

    // Add validation for dam class vs dimensions
    survey.onValidateQuestion.add((sender, options) => {
      if (options.name === "height" || options.name === "capacity") {
        const damClass = survey.getValue("damClass");
        const height = parseFloat(survey.getValue("height")) || 0;
        const capacity = parseFloat(survey.getValue("capacity")) || 0;

        if (damClass === "verySmall" && (height < 0 || height > 4.5)) {
          options.error = "Very Small dams must be between 0-4.5 meters in height";
        }
        else if (damClass === "small" && (height <= 4.5 || height >= 8.0)) {
          options.error = "Small dams must be between 4.5-8.0 meters in height";
        }
        else if (damClass === "medium" && (height <= 8.0 || height >= 15.0)) {
          options.error = "Medium dams must be between 8.0-15.0 meters in height";
        }
        else if (damClass === "large" && height <= 15.0) {
          options.error = "Large dams must be over 15.0 meters in height";
        }

        if (damClass === "verySmall" && capacity >= 500000) {
          options.error = "Very Small dams must have capacity <500,000 m³";
        }
        else if (damClass === "small" && capacity >= 1000000) {
          options.error = "Small dams must have capacity <1,000,000 m³";
        }
        else if (damClass === "medium" && capacity >= 5000000) {
          options.error = "Medium dams must have capacity <5,000,000 m³";
        }
        else if (damClass === "large" && capacity < 5000000) {
          options.error = "Large dams must have capacity >5,000,000 m³";
        }
      }
    }); */

