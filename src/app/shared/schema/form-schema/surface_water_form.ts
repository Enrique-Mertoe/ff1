/*import { Component, OnInit } from '@angular/core';
import { Model } from 'survey-core';

@Component({
  selector: 'app-water-abstraction-form',
  templateUrl: './water-abstraction-form.component.html',
  styleUrls: ['./water-abstraction-form.component.css']
})
export class WaterAbstractionFormComponent implements OnInit {
  surveyModel: Model;

  ngOnInit() { */
  export const SURFACE_WATER_APPLICATION_FORM = {
      title: "Application for Water Abstraction Permit",
      description: "Water Resources Regulations, 2017 - Surface Water Application",
      showProgressBar: "top",
      pages: [
        {
          name: "clientInfo",
          title: "1. Names and addresses of client",
          elements: [
            {
              type: "text",
              name: "clientName",
              title: "Name",
              isRequired: true
            },
            {
              type: "text",
              name: "clientAddress",
              title: "Address"
            },
            {
              type: "text",
              name: "clientDistrict",
              title: "District"
            },
            {
              type: "text",
              name: "clientTelephone",
              title: "Telephone",
              inputType: "tel"
            },
            {
              type: "text",
              name: "clientMobile",
              title: "Mobile Phone",
              inputType: "tel"
            },
            {
              type: "text",
              name: "clientFax",
              title: "Fax"
            },
            {
              type: "text",
              name: "clientEmail",
              title: "Email",
              inputType: "email"
            }
          ]
        },
        {
          name: "landInfo",
          title: "2. Land requiring water",
          elements: [
            {
              type: "text",
              name: "landownerWorksExist",
              title: "Name of landowner where (i) the works exist"
            },
            {
              type: "text",
              name: "landownerWaterUseExist",
              title: "Name of landowner where (ii) use of water exist"
            },
            {
              type: "text",
              name: "landownerAddress",
              title: "Address of landowner if different from above"
            },
            {
              type: "radiogroup",
              name: "propertyRegime",
              title: "Property regime of land",
              isRequired: true,
              choices: [
                { value: "customary", text: "Customary" },
                { value: "leasehold", text: "Leasehold" },
                { value: "freehold", text: "Freehold" }
              ]
            },
            {
              type: "text",
              name: "leaseholdPlotNo",
              title: "If leasehold, indicate Plot No.",
              visibleIf: "{propertyRegime} = 'leasehold'"
            },
            {
              type: "text",
              name: "freeholdPlotNo",
              title: "If freehold, indicate Plot No.",
              visibleIf: "{propertyRegime} = 'freehold'"
            },
            {
              type: "text",
              name: "landWorksLocation",
              title: "Location of land where works is situated"
            },
            {
              type: "text",
              name: "landWaterUseLocation",
              title: "Location of land where use of water is taking place"
            },
            {
              type: "text",
              name: "village",
              title: "Village"
            },
            {
              type: "text",
              name: "traditionalAuthority",
              title: "Traditional Authority"
            },
            {
              type: "text",
              name: "landArea",
              title: "Area of that land (hectares)",
              inputType: "number"
            }
          ]
        },
        {
          name: "waterSource",
          title: "3. Source of water",
          elements: [
            {
              type: "dropdown",
              name: "coreWaterSourceType",
              title: "Source of water type",
              description: "Select the source of water type as appropriate",
              choices: [],
              isRequired: true
            },
            {
              type: "html",
              name: "coreWaterSourceHtml",
              html: `
                <div style="margin-bottom: 20px;">
                  <label style="font-weight: bold; display: block; margin-bottom: 8px;">
                    Source of water <span style="color: red;">*</span>
                  </label>
                  <p style="color: #666; font-size: 14px; margin-bottom: 10px;">
                    Select the source of water as appropriate (select water source type first)
                  </p>
                  <select 
                    id="coreWaterSourceSelect" 
                    name="coreWaterSource"
                    style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px;"
                  >
                    <option value="">-- Please select a water source type first --</option>
                  </select>
                </div>
              `
            },
            {
              type: "text",
              name: "coreWaterSource",
              title: "Selected Water Source ID (hidden)",
              visible: false
            },
            {
              type: "text",
              name: "waterSourceName",
              title: "Name of the source of water"
            },
            {
              type: "text",
              name: "waterDiversionLocation",
              title: "Exact Name where the water was diverted, stored or used"
            },
            {
              type: "text",
              name: "waterSourceCoordinates",
              title: "Coordinates (in UTM format)"
            },
            {
              type: "text",
              name: "waterUptakeDistrict",
              title: "District where the water uptake is located (when applicable)"
            },
            {
              type: "file",
              name: "topographicMap",
              title: "Attach a topographic map 1:50,000, indicating location of the intake works",
              acceptedTypes: ".jpg,.jpeg,.png,.pdf"
            }
          ]
        },
        {
          name: "waterQuantity",
          title: "4. Quantity (m³/day) and Use of water",
          elements: [
            {
              type: "matrixdynamic",
              name: "waterUses",
              title: "Select water uses and specify quantities",
              addRowText: "Add Water Use",
              removeRowText: "Remove",
              columns: [
                {
              name: "useType",
              title: "Use of Water",
              cellType: "dropdown",
              isRequired: true,
              choices: [
                "Irrigation",
                "Livestock",
                "Urban domestic",
                "Rural domestic",
                "Industrial",
                "Fisheries services",
                "Power generation",
                "Recreational",
                "Other"
              ]
            },
            {
              name: "quantity",
              title: "Quantity (m³/day)",
              cellType: "text",
              inputType: "number",
              isRequired: true
            },
            {
              name: "otherSpecify",
              title: "Please specify",
              cellType: "text",
              visibleIf: "{row.useType} = 'Other'"
            }
          ],
          rowCount: 1
        },
        {
          type: "panel",
          name: "totalVolumePanel",
          elements: [
            {
              type: "expression",
              name: "totalVolume",
              title: "Total Volume (m³/day)",
              expression: "sum({waterUses.quantity})"
            }
          ]
        }
      ]
    },
    {
      name: "technicalDetails",
      title: "5. Technical details of the works",
      elements: [
        {
          type: "panel",
          name: "diversionPanel",
          title: "5.1 Diversion",
          elements: [
            {
              type: "panel",
              name: "canalPanel",
              title: "(a) Canal",
              elements: [
                {
                  type: "text",
                  name: "canalBottomWidth",
                  title: "Width at bottom (m)",
                  inputType: "number"
                },
                {
                  type: "text",
                  name: "canalFullSupplyWidth",
                  title: "Width at full supply level (m)",
                  inputType: "number"
                },
                {
                  type: "text",
                  name: "canalDepth",
                  title: "Depth of water at full supply level (m)",
                  inputType: "number"
                },
                {
                  type: "text",
                  name: "canalLength",
                  title: "Length (m)",
                  inputType: "number"
                },
                {
                  type: "text",
                  name: "canalGradient",
                  title: "Gradient"
                },
                {
                  type: "text",
                  name: "canalVelocity",
                  title: "Average velocity (m/s)",
                  inputType: "number"
                },
                {
                  type: "text",
                  name: "canalDischarge",
                  title: "Estimated discharge at full supply depth (m³/day)",
                  inputType: "number"
                },
                {
                  type: "text",
                  name: "canalMaterials",
                  title: "Materials of which canal is constructed"
                },
                {
                  type: "text",
                  name: "canalAffectedLand",
                  title: "Name of land affected (if any)"
                },
                {
                  type: "text",
                  name: "canalOwnersOccupiers",
                  title: "Name of its owners and occupiers"
                }
              ]
            },
            {
              type: "panel",
              name: "pipePanel",
              title: "(b) Pipe",
              elements: [
                {
                  type: "text",
                  name: "pipeDiameter",
                  title: "Internal diameter (mm)",
                  inputType: "number"
                },
                {
                  type: "text",
                  name: "pipeLength",
                  title: "Length (m)",
                  inputType: "number"
                },
                {
                  type: "text",
                  name: "pipeHydraulicGradient",
                  title: "Hydraulic gradient"
                },
                {
                  type: "text",
                  name: "pipeThickness",
                  title: "Pipe thickness (mm)",
                  inputType: "number"
                },
                {
                  type: "text",
                  name: "pipeMaterial",
                  title: "Description of pipe material"
                }
              ]
            },
            {
              type: "comment",
              name: "otherStructures",
              title: "(c) Any other structures"
            },
            {
              type: "radiogroup",
              name: "structuresAffectLand",
              title: "Do any canals, pipes or structures affect another person's land?",
              choices: ["Yes", "No"]
            },
            {
              type: "text",
              name: "affectedLandName",
              title: "If so, name of land affected",
              visibleIf: "{structuresAffectLand} = 'Yes'"
            },
            {
              type: "text",
              name: "affectedLandOwners",
              title: "Name of its owners and occupiers",
              visibleIf: "{structuresAffectLand} = 'Yes'"
            },
            {
              type: "text",
              name: "waterVolumeMeasurement",
              title: "How do you measure the volume of water used?"
            },
            {
              type: "text",
              name: "measuringEquipment",
              title: "What type of measuring equipment has been installed?"
            }
          ]
        },
        {
          type: "panel",
          name: "pumpPanel",
          title: "5.2 Pump",
          elements: [
            {
              type: "radiogroup",
              name: "pumpType",
              title: "Type of pump",
              choices: [
                { value: "centrifugal", text: "Centrifugal" },
                { value: "submersible", text: "Submersible" },
                { value: "other", text: "Other" }
              ]
            },
            {
              type: "text",
              name: "pumpTypeOther",
              title: "Specify other pump type",
              visibleIf: "{pumpType} = 'other'"
            },
            {
              type: "radiogroup",
              name: "pumpPower",
              title: "Means of Power",
              choices: [
                { value: "solar", text: "Solar" },
                { value: "electricity", text: "Electricity" },
                { value: "manual", text: "Manual" },
                { value: "other", text: "Other" }
              ]
            },
            {
              type: "text",
              name: "pumpPowerOther",
              title: "Specify other power means",
              visibleIf: "{pumpPower} = 'other'"
            },
            {
              type: "text",
              name: "pumpHorsepower",
              title: "Brake horsepower of machine (BHP)",
              inputType: "number"
            },
            {
              type: "text",
              name: "pumpSuctionDiameter",
              title: "Internal diameter of suction main (mm)",
              inputType: "number"
            },
            {
              type: "text",
              name: "pumpSuctionHeight",
              title: "Maximum height of suction (mm)",
              inputType: "number"
            },
            {
              type: "text",
              name: "pumpSuctionLength",
              title: "Length of suction pipe (mm)",
              inputType: "number"
            },
            {
              type: "text",
              name: "pumpLiftHeight",
              title: "Height to which the pump will lift the water (m)",
              inputType: "number"
            },
            {
              type: "text",
              name: "pumpDeliveryDiameter",
              title: "Internal diameter of delivery pipe (mm)",
              inputType: "number"
            },
            {
              type: "text",
              name: "pumpDeliveryLength",
              title: "Length of delivery pipe (m)",
              inputType: "number"
            },
            {
              type: "text",
              name: "pumpHoursPerDay",
              title: "Pumping hours per day",
              inputType: "number"
            },
            {
              type: "text",
              name: "pumpQuantityPerDay",
              title: "Quantity of water pumped when plant is working (m³/day)",
              inputType: "number"
            }
          ]
        }
      ]
    },
    {
      name: "otherInformation",
      title: "6. Other information",
      elements: [
        {
          type: "radiogroup",
          name: "waterHarmfulEffects",
          title: "Is the water used, in any way which increases silt, gravel or other solids in the water source, or makes it likely to harm people, animals, fish, crops or gardens?",
          choices: ["Yes", "No"]
        },
        {
          type: "comment",
          name: "remedialMeasures",
          title: "If 'Yes' are there any remedial or preventative measures to reverse or reduce the negative impacts above?",
          visibleIf: "{waterHarmfulEffects} = 'Yes'"
        },
        {
          type: "comment",
          name: "otherWaterPermits",
          title: "Give details of any other water permits relating to the same land as this application"
        },
        {
          type: "text",
          name: "waterUseStartDate",
          title: "When did the use of water applied for begin?",
          inputType: "date"
        },
        {
          type: "file",
          name: "developmentPlan",
          title: "Attach your development plan",
          acceptedTypes: ".jpg,.jpeg,.png,.pdf,.doc,.docx"
        },
        {
          type: "text",
          name: "permitDuration",
          title: "For how long will you require a water permit?"
        }
      ]
    },
    {
      name: "purposeSpecific",
      title: "Purpose-Specific Information",
      elements: [
        {
          type: "radiogroup",
          name: "purposeType",
          title: "Select the purpose of water use",
          isRequired: true,
          choices: [
            { value: "domestic", text: "Domestic" },
            { value: "public", text: "Public" },
            { value: "industrial", text: "Industrial" },
            { value: "irrigation", text: "Irrigation" },
            { value: "power", text: "Power generation" },
            { value: "dam", text: "Dam Construction" },
            { value: "other", text: "Other purposes" }
          ]
        },
        // Domestic purposes panel
        {
          type: "panel",
          name: "domesticPanel",
          title: "Part A - Domestic purposes",
          visibleIf: "{purposeType} = 'domestic'",
          elements: [
            {
              type: "panel",
              name: "householdPanel",
              title: "1. Household and sanitary use",
              elements: [
                {
                  type: "text",
                  name: "lowDensityHouses",
                  title: "No. of low density houses",
                  inputType: "number"
                },
                {
                  type: "text",
                  name: "mediumDensityOccupants",
                  title: "No. of occupants of medium density houses",
                  inputType: "number"
                },
                {
                  type: "text",
                  name: "highDensityOccupants",
                  title: "No. of occupants of high density houses",
                  inputType: "number"
                },
                {
                  type: "text",
                  name: "householdQuantity",
                  title: "Quantity required (m³/day)",
                  inputType: "number"
                }
              ]
            },
            {
              type: "panel",
              name: "stockPanel",
              title: "2. Stock watering",
              elements: [
                {
                  type: "text",
                  name: "largeStockNumber",
                  title: "No. of large stock",
                  inputType: "number"
                },
                {
                  type: "text",
                  name: "largeStockType",
                  title: "Type of large stock"
                },
                {
                  type: "text",
                  name: "smallStockNumber",
                  title: "No. of small stock",
                  inputType: "number"
                },
                {
                  type: "text",
                  name: "smallStockType",
                  title: "Type of small stock"
                },
                {
                  type: "text",
                  name: "stockQuantity",
                  title: "Quantity required (m³/day)",
                  inputType: "number"
                }
              ]
            },
            {
              type: "panel",
              name: "animalsPanel",
              title: "3. Cattle, Sheep and goats, pigs, poultry, donkey",
              elements: [
                {
                  type: "text",
                  name: "animalDipNumber",
                  title: "No. of animal dip",
                  inputType: "number"
                },
                {
                  type: "text",
                  name: "animalsQuantity",
                  title: "Quantity required (m³/day)",
                  inputType: "number"
                }
              ]
            },
            {
              type: "panel",
              name: "farmingPanel",
              title: "4. Other non-industrial farming operations",
              elements: [
                {
                  type: "comment",
                  name: "farmingOperations",
                  title: "Please describe"
                },
                {
                  type: "text",
                  name: "farmingQuantity",
                  title: "Quantity required (m³/day)",
                  inputType: "number"
                }
              ]
            },
            {
              type: "expression",
              name: "domesticTotalVolume",
              title: "Total volume (m³/day)",
              expression: "{householdQuantity} + {stockQuantity} + {animalsQuantity} + {farmingQuantity}"
            }
          ]
        },
        // Public purposes panel
        {
          type: "panel",
          name: "publicPanel",
          title: "Part B - Public purposes",
          visibleIf: "{purposeType} = 'public'",
          elements: [
            {
              type: "matrixdynamic",
              name: "publicPurposes",
              title: "1. How much water is used for each or any of the following purposes? (cubic metres per day)",
              addRowText: "Add Purpose",
              removeRowText: "Remove",
              columns: [
                {
                  name: "purpose",
                  title: "Purpose",
                  cellType: "dropdown",
                  isRequired: true,
                  choices: [
                    "Municipal, urban or community purposes or supply to others in return for payment",
                    "Other purposes"
                  ]
                },
                {
                  name: "quantityPresent",
                  title: "Quantity required present (m³/day)",
                  cellType: "text",
                  inputType: "number"
                },
                {
                  name: "quantity5Years",
                  title: "Quantity required in 5 years (m³/day)",
                  cellType: "text",
                  inputType: "number"
                },
                {
                  name: "otherPurposeSpecify",
                  title: "Specify other purpose",
                  cellType: "text",
                  visibleIf: "{row.purpose} = 'Other purposes'"
                }
              ],
              rowCount: 1
            },
            {
              type: "expression",
              name: "publicTotalVolume",
              title: "Total water required for public purposes (m³/day)",
              expression: "sum({publicPurposes.quantityPresent})"
            },
            {
              type: "panel",
              name: "populationPanel",
              title: "2. If water is used for municipal purposes, please provide the following estimates:",
              elements: [
                {
                  type: "matrixdynamic",
                  name: "populationEstimates",
                  title: "Population Estimates",
                  addRowText: "Add Estimate",
                  removeRowText: "Remove",
                  columns: [
                    {
                      name: "category",
                      title: "Population Estimate Category",
                      cellType: "dropdown",
                      isRequired: true,
                      choices: [
                        "Estimated population at present",
                        "Estimated population 5 years hence",
                        "Estimated population 10 years hence",
                        "Estimated population 20 years hence"
                      ]
                    },
                    {
                      name: "lowDensityHouses",
                      title: "Low Density Area - No. of houses",
                      cellType: "text",
                      inputType: "number"
                    },
                    {
                      name: "mediumDensityOccupants",
                      title: "Medium Density Area - No. of occupants",
                      cellType: "text",
                      inputType: "number"
                    },
                    {
                      name: "highDensityOccupants",
                      title: "High Density Area - No. of occupants",
                      cellType: "text",
                      inputType: "number"
                    }
                  ],
                  rowCount: 1
                }
              ]
            },
            {
              type: "comment",
              name: "otherPublicUse",
              title: "3. If water is used for other purposes, to what use is the water to be put?"
            },
            {
              type: "radiogroup",
              name: "supplyForPayment",
              title: "4. Does the applicant supply water to any other person, in return for payment?",
              choices: ["Yes", "No"]
            }
          ]
        },
        // Industrial purposes panel
        {
          type: "panel",
          name: "industrialPanel",
          title: "Part C - Industrial purposes",
          visibleIf: "{purposeType} = 'industrial'",
          elements: [
            {
              type: "matrixdynamic",
              name: "industrialPurposes",
              title: "State the quantity of water required",
              addRowText: "Add Purpose",
              removeRowText: "Remove",
              columns: [
                {
                  name: "purpose",
                  title: "Purpose",
                  cellType: "dropdown",
                  isRequired: true,
                  choices: [
                    "Stream raising, cooling and condensing water",
                    "Manufacturing - Process water",
                    "Manufacturing - Dilution of effluent",
                    "Coffee pulping and washing",
                    "Other purposes"
                  ]
                },
                {
                  name: "quantity",
                  title: "Quantity (m³/day)",
                  cellType: "text",
                  inputType: "number"
                },
                {
                  name: "normalHours",
                  title: "Normal working hours for the factory in a day",
                  cellType: "text"
                },
                {
                  name: "maxHours",
                  title: "Max working hours for the factory in a day",
                  cellType: "text"
                },
                {
                  name: "period",
                  title: "Period during year when water is required",
                  cellType: "text"
                },
                {
                  name: "otherSpecify",
                  title: "Specify other purpose",
                  cellType: "text",
                  visibleIf: "{row.purpose} = 'Other purposes'"
                }
              ],
              rowCount: 1
            },
            {
              type: "expression",
              name: "industrialTotalVolume",
              title: "Total water required (m³/day)",
              expression: "sum({industrialPurposes.quantity})"
            }
          ]
        },
        // Irrigation purposes panel
        {
          type: "panel",
          name: "irrigationPanel",
          title: "Part D - Irrigation purposes",
          visibleIf: "{purposeType} = 'irrigation'",
          elements: [
            {
              type: "matrixdynamic",
              name: "irrigationCrops",
              title: "(a) Crops irrigated (name), area of each (hectares) and the growing season (name months)",
              addRowText: "Add Crop",
              removeRowText: "Remove",
              columns: [
                {
                  name: "cropName",
                  title: "Crop Name",
                  cellType: "text",
                  isRequired: true
                },
                {
                  name: "area",
                  title: "Area (hectares)",
                  cellType: "text",
                  inputType: "number"
                },
                {
                  name: "seasonFrom",
                  title: "Growing Season - From (month)",
                  cellType: "dropdown",
                  choices: [
                    "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                  ]
                },
                {
                  name: "seasonTo",
                  title: "Growing Season - To (month)",
                  cellType: "dropdown",
                  choices: [
                    "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                  ]
                }
              ],
              rowCount: 1
            },
            {
              type: "panel",
              name: "monthlyQuantityPanel",
              title: "(b) Mean quantity of water in cubic metres per day",
              elements: [
                {
                  type: "text",
                  name: "janQuantity",
                  title: "January",
                  inputType: "number"
                },
                {
                  type: "text",
                  name: "febQuantity",
                  title: "February",
                  inputType: "number"
                },
                {
                  type: "text",
                  name: "marQuantity",
                  title: "March",
                  inputType: "number"
                },
                {
                  type: "text",
                  name: "aprQuantity",
                  title: "April",
                  inputType: "number"
                },
                {
                  type: "text",
                  name: "mayQuantity",
                  title: "May",
                  inputType: "number"
                },
                {
                  type: "text",
                  name: "junQuantity",
                  title: "June",
                  inputType: "number"
                },
                {
                  type: "text",
                  name: "julQuantity",
                  title: "July",
                  inputType: "number"
                },
                {
                  type: "text",
                  name: "augQuantity",
                  title: "August",
                  inputType: "number"
                },
                {
                  type: "text",
                  name: "sepQuantity",
                  title: "September",
                  inputType: "number"
                },
                {
                  type: "text",
                  name: "octQuantity",
                  title: "October",
                  inputType: "number"
                },
                {
                  type: "text",
                  name: "novQuantity",
                  title: "November",
                  inputType: "number"
                },
                {
                  type: "text",
                  name: "decQuantity",
                  title: "December",
                  inputType: "number"
                }
              ]
            },
            {
              type: "text",
              name: "soilType",
              title: "(c) What type of soil is irrigated?"
            },
            {
              type: "radiogroup",
              name: "subsoilPermeable",
              title: "(d) Is the subsoil permeable to drainage?",
              choices: ["Yes", "No"]
            },
            {
              type: "comment",
              name: "drainageWorks",
              title: "(e) Describe what drainage works are constructed on the irrigated land."
            },
            {
              type: "text",
              name: "unusedWaterDisposal",
              title: "(f) How is unused water disposed of?"
            },
            {
              type: "text",
              name: "waterSourceReturn",
              title: "(g) Name the water source to which it is returned:"
            }
          ]
        },
        // Power generation panel
        {
          type: "panel",
          name: "powerPanel",
          title: "Part E - Use of water for power generation",
          visibleIf: "{purposeType} = 'power'",
          elements: [
            {
              type: "text",
              name: "powerPurpose",
              title: "(a) Purpose for which power is used"
            },
            {
              type: "panel",
              name: "horsepowerPanel",
              title: "(b) Brake horsepower developed",
              elements: [
                {
                  type: "text",
                  name: "maxHorsepower",
                  title: "(i) Maximum (BHP)",
                  inputType: "number"
                },
                {
                  type: "text",
                  name: "maxKilowatts",
                  title: "(kW)",
                  inputType: "number"
                },
                {
                  type: "text",
                  name: "minHorsepower",
                  title: "(ii) Minimum (BHP)",
                  inputType: "number"
                },
                {
                  type: "text",
                  name: "minKilowatts",
                  title: "(kW)",
                  inputType: "number"
                }
              ]
            },
            {
              type: "panel",
              name: "headPanel",
              title: "(c) Gross fall or head available for power production at the following river stages",
              elements: [
                {
                  type: "text",
                  name: "lowStageHead",
                  title: "(i) at low stage (m)",
                  inputType: "number"
                },
                {
                  type: "text",
                  name: "normalStageHead",
                  title: "(ii) at normal stage (m)",
                  inputType: "number"
                },
                {
                  type: "text",
                  name: "highStageHead",
                  title: "(iii) at high stage (m)",
                  inputType: "number"
                }
              ]
            },
            {
              type: "text",
              name: "netFallHead",
              title: "The net fall or head used in (b) above (m)",
              inputType: "number"
            },
            {
              type: "text",
              name: "waterRequired",
              title: "The water required to develop (b) above (m³/day)",
              inputType: "number"
            },
            {
              type: "text",
              name: "machineType",
              title: "Type of machines installed"
            },
            {
              type: "text",
              name: "machineNumber",
              title: "Number of machines installed",
              inputType: "number"
            },
            {
              type: "text",
              name: "waterReturnMethod",
              title: "How is water returned to its source after use?"
            },
            {
              type: "text",
              name: "returnChannelLength",
              title: "State length of any return channel (m)",
              inputType: "number"
            }
          ]
        },
        // Dam construction panel
        {
          type: "panel",
          name: "damPanel",
          title: "Part F - Construction of dam",
          visibleIf: "{purposeType} = 'dam'",
          elements: [
            {
              type: "panel",
              name: "damInfoPanel",
              title: "1. Please provide the following information for all dams",
              elements: [
                {
                  type: "text",
                  name: "streamBedNature",
                  title: "(a) Nature of stream bed at site (e.g., sound rock, fissured rock, sand)"
                },
                {
                  type: "text",
                  name: "riverWallsNature",
                  title: "(b) Nature of walls of river at site (e.g. sand, soil)"
                },
                {
                  type: "radiogroup",
                  name: "foundedOnRock",
                  title: "(c) Will dam be founded on sound rock?",
                  choices: ["Yes", "No"]
                },
                {
                  type: "radiogroup",
                  name: "foundedOnErodible",
                  title: "(d) Will dam be founded on any material which may be eroded by underflow?",
                  choices: ["Yes", "No"]
                },
                {
                  type: "text",
                  name: "damType",
                  title: "(e) Describe type of dam (e.g., earth with core wall, concrete, masonry)"
                },
                {
                  type: "panel",
                  name: "damDimensionsPanel",
                  title: "(f) Dam dimensions",
                  elements: [
                    {
                      type: "text",
                      name: "crestLength",
                      title: "Length of crest of dam (m)",
                      inputType: "number"
                    },
                    {
                      type: "text",
                      name: "maxHeight",
                      title: "Maximum height of dam (m)",
                      inputType: "number"
                    },
                    {
                      type: "text",
                      name: "crestThickness",
                      title: "Thickness at crest (m)",
                      inputType: "number"
                    },
                    {
                      type: "text",
                      name: "baseThickness",
                      title: "Thickness at base (m)",
                      inputType: "number"
                    }
                  ]
                },
                {
                  type: "text",
                  name: "reservoirArea",
                  title: "(g) Estimated area of reservoir at spillway (ha.)",
                  inputType: "number"
                },
                {
                  type: "text",
                  name: "reservoirCapacity",
                  title: "(h) Estimated reservoir storage capacity (m³)",
                  inputType: "number"
                },
                {
                  type: "radiogroup",
                  name: "submergedAreaOtherLand",
                  title: "(i) Will the submerged area at high flood level be on another person's land?",
                  choices: ["Yes", "No"]
                },
                {
                  type: "text",
                  name: "otherLandowners",
                  title: "If so, give the name of other landowners",
                  visibleIf: "{submergedAreaOtherLand} = 'Yes'"
                },
                {
                  type: "radiogroup",
                  name: "bankOwnedByOther",
                  title: "(j) Is either bank of the stream at the site of dam owned by another person?",
                  choices: ["Yes", "No"]
                },
                {
                  type: "text",
                  name: "bankLandowners",
                  title: "If so, give the name of other land owners",
                  visibleIf: "{bankOwnedByOther} = 'Yes'"
                },
                {
                  type: "comment",
                  name: "affectedWorks",
                  title: "(k) Will any other works including weirs, already constructed or being constructed, be affected by the head and/or tail water level of the proposed works? (If so, give full details of the works affected)"
                }
              ]
            },
            {
              type: "panel",
              name: "catchmentPanel",
              title: "2. If the dam exceeds 70,000 cubic metres in volume or 5 metres in height, please provide the following information about its catchment area",
              elements: [
                {
                  type: "text",
                  name: "catchmentArea",
                  title: "(a) Area of surface catchment (km²)",
                  inputType: "number"
                },
                {
                  type: "text",
                  name: "catchmentLength",
                  title: "(b) Maximum length of catchment (km.)",
                  inputType: "number"
                },
                {
                  type: "text",
                  name: "catchmentBreadth",
                  title: "(c) Average breadth of catchment (km.)",
                  inputType: "number"
                },
                {
                  type: "text",
                  name: "catchmentSlope",
                  title: "(d) General/average/dominant slope of catchment (fall per km.)"
                },
                {
                  type: "text",
                  name: "catchmentGround",
                  title: "(e) Nature of ground of catchment (e.g., rocky, stony soil, clay soil)"
                },
                {
                }]}]}]}]}

              //}}
