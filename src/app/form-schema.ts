export const schema = {
  title: 'New ground water permit',
  showProgressBar: 'top',
  progressBarType: 'buttons',
  pages: [
    {
      name: 'personalInformation',
      navigationTitle: {
        default: 'Personal information',
        fr: 'Informations personnelles',
      },
      navigationDescription: {
        default: 'Tell us about you',
        fr: 'Parlez nous de vous',
      },
      startWithNewLine: false,
      showQuestionNumbers: 'off',
      elements: [
        {
          type: 'text',
          name: 'fullname',
          title: {
            default: 'Full name',
            fr: 'Nom et prénom',
          },
          isRequired: true,
        },
        {
          type: 'text',
          name: 'address',
          title: {
            default: 'Address',
            fr: 'Adresse',
          },
          isRequired: true,
        },
        {
          "type": "dropdown",
          "name": "area",
          "title": {
            "default": "District",
            "fr": "Diplôme"
          },
          "isRequired": true,
          "showNoneItem": false,
          "showOtherItem": false,
          "choices": [
            {
              "value": "Balaka",
              "text": {
                "default": "Balaka",
                "fr": "License"
              }
            },
            {
              "value": "Blantyre",
              "text": {
                "default": "Blantyre",
                "fr": "Baccalauréat"
              }
            },
            {
              "value": "Chikwawa",
              "text": {
                "default": "Chikwawa",
                "fr": "Master"
              }
            },
            {
              "value": "Chiradzulu",
              "text": {
                "default": "Chiradzulu",
                "fr": "Doctorat"
              }
            },
            {
              "value": "Chitipa",
              "text": {
                "default": "Chitipa",
                "fr": "Doctorat"
              }
            },
            {
              "value": "Dedza",
              "text": {
                "default": "Dedza",
                "fr": "Doctorat"
              }
            },
            {
              "value": "Dowa",
              "text": {
                "default": "Dowa",
                "fr": "Doctorat"
              }
            },
            {
              "value": "Karonga",
              "text": {
                "default": "Karonga",
                "fr": "Doctorat"
              }
            },
            {
              "value": "Kasungu",
              "text": {
                "default": "Kasungu",
                "fr": "Doctorat"
              }
            },
            {
              "value": "Likoma",
              "text": {
                "default": "Likoma",
                "fr": "Doctorat"
              }
            },
            {
              "value": "Lilongwe",
              "text": {
                "default": "Lilongwe",
                "fr": "Doctorat"
              }
            },
            {
              "value": "Machinga",
              "text": {
                "default": "Machinga",
                "fr": "Doctorat"
              }
            },
            {
              "value": "Mangochi",
              "text": {
                "default": "Mangochi",
                "fr": "Doctorat"
              }
            },
            {
              "value": "Mchinji",
              "text": {
                "default": "Mchinji",
                "fr": "Doctorat"
              }
            },
            {
              "value": "Mulanje",
              "text": {
                "default": "Mulanje",
                "fr": "Doctorat"
              }
            },
            {
              "value": "Mwanza",
              "text": {
                "default": "Mwanza",
                "fr": "Doctorat"
              }
            },
            {
              "value": "Mzimba",
              "text": {
                "default": "Mzimba",
                "fr": "Doctorat"
              }
            },
            {
              "value": "Mzuzu",
              "text": {
                "default": "Mzuzu",
                "fr": "Doctorat"
              }
            },
            {
              "value": "Neno",
              "text": {
                "default": "Neno",
                "fr": "Doctorat"
              }
            },
            {
              "value": "Nkhata Bay",
              "text": {
                "default": "Nkhata Bay",
                "fr": "Doctorat"
              }
            },
            {
              "value": "Nkhotakota",
              "text": {
                "default": "Nkhotakota",
                "fr": "Doctorat"
              }
            },
            {
              "value": "Nsanje",
              "text": {
                "default": "Nsanje",
                "fr": "Doctorat"
              }
            },
            {
              "value": "Ntcheu",
              "text": {
                "default": "Ntcheu",
                "fr": "Doctorat"
              }
            },
            {
              "value": "Ntchisi",
              "text": {
                "default": "Ntchisi",
                "fr": "Doctorat"
              }
            },
            {
              "value": "Phalombe",
              "text": {
                "default": "Phalombe",
                "fr": "Doctorat"
              }
            },
            {
              "value": "Rumphi",
              "text": {
                "default": "Rumphi",
                "fr": "Doctorat"
              }
            },
            {
              "value": "Salima",
              "text": {
                "default": "Salima",
                "fr": "Doctorat"
              }
            },
            {
              "value": "Thyolo",
              "text": {
                "default": "Thyolo",
                "fr": "Doctorat"
              }
            },
            {
              "value": "Zomba",
              "text": {
                "default": "Zomba",
                "fr": "Doctorat"
              }
            }
          ]
        },
        {
          type: 'text',
          name: 'phone',
          title: {
            default: 'Telephone number',
            fr: 'Numéro de téléphone',
          },
          inputType: 'tel',
          isRequired: true,
          validators: [
            {
              type: 'regex',
              // regex: "\\+[0–9]{1} \\([0–9]{3}\\) [0–9]{3}-[0–9]{2}-[0–9]{2}",
              text: 'Phone number must be in the following format: +0 (000) 000--00--00',
            },
          ],
        },
        {
          type: 'text',
          name: 'mobile',
          title: {
            default: 'Mobile number',
            fr: 'Pays',
          },
          isRequired: true,
        },
        {
          type: 'text',
          name: 'email',
          title: {
            default: 'Email',
            fr: 'Adresse email',
          },
          inputType: 'email',
          isRequired: true,
        },
      ],
    },
    {
      name: 'landRequiringWater',
      navigationTitle: {
        default: 'Land requiring water',
        fr: 'Land requiring water',
      },
      navigationDescription: {
        default: 'Source and destination of water resource',
        fr: 'Parlez-nous de votre formation',
      },
      elements: [
        {
          type: 'paneldynamic',
          name: 'waterSourceAndDestination',
          title: {
            default: 'Land requiring water',
            fr: 'Formations',
          },
          keyName: 'source_owner_fullname',
          showQuestionNumbers: 'off',
          templateTitle: {
            default: 'Land requiring water #{panelIndex}',
            fr: 'Formation #{panelIndex}',
          },
          minPanelCount: 1,
          maxPanelCount: 2,
          panelAddText: {
            default: 'Add another Source/Destination Land',
            fr: 'Ajouter une autre formation',
          },
          panelRemoveText: {
            default: 'Remove land',
            fr: 'Supprimer la formation',
          },
          templateElements: [
            {
              type: 'dropdown',
              name: 'source',
              title: {
                default: 'Source',
                fr: 'Diplôme',
              },
              isRequired: true,
              showNoneItem: true,
              showOtherItem: true,
              choices: [
                {
                  value: 'source_owner',
                  text: {
                    default: 'Source land',
                    fr: 'Baccalauréat',
                  },
                },
                {
                  value: 'destination',
                  text: {
                    default: 'Destination land',
                    fr: 'License',
                  },
                }
              ],
            },
            {
              type: 'text',
              name: 'source_owner_fullname',
              title: {
                default: 'Full name of source owner',
                fr: 'Ecole ou université',
              },
              isRequired: true,
            },
            {
              type: 'comment',
              name: 'description',
              title: {
                default: 'Description of the land',
                fr: 'Description de ce que vous avez étudié',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'experience',
      navigationTitle: {
        default: 'Source & use of water',
        fr: 'Experience',
      },
      navigationDescription: {
        default: 'Water use',
        fr: 'Dites-nous en plus sur votre expérience',
      },
      elements: [
        {
          type: 'paneldynamic',
          name: 'experiences',
          title: {
            default: 'Experiences',
            fr: 'Expériences',
          },
          keyName: 'position',
          showQuestionNumbers: 'off',
          templateTitle: {
            default: 'Experience #{panelIndex}',
            fr: 'Expérience #{panelIndex}',
          },
          minPanelCount: 1,
          maxPanelCount: 3,
          panelAddText: {
            default: 'Add another experience',
            fr: 'Ajouter une autre expérience',
          },
          panelRemoveText: {
            default: 'Remove experience',
            fr: "Supprimer l'expérience",
          },
          templateElements: [
            {
              type: 'text',
              name: 'position',
              title: {
                default: 'Position',
                fr: 'Poste',
              },
              isRequired: true,
            },
            {
              type: 'text',
              name: 'company',
              title: {
                default: 'Company',
                fr: 'Entreprise',
              },
              isRequired: true,
            },
            {
              type: 'text',
              name: 'startDate',
              title: {
                default: 'Start date',
                fr: 'Date de début',
              },
              inputType: 'date',
              isRequired: true,
            },
            {
              type: 'text',
              name: 'endDate',
              title: {
                default: 'End date',
                fr: 'Date de fin',
              },
              inputType: 'date',
              isRequired: true,
              visibleIf: '{panel.untilNow}=false',
            },
            {
              type: 'boolean',
              name: 'untilNow',
              title: {
                default: 'Until now',
                fr: "Jusqu'à maintenant",
              },
              isRequired: true,
              defaultValue: false,
            },
            {
              type: 'comment',
              name: 'description',
              title: {
                default: 'Description of what you have worked on',
                fr: 'Description de ce sur quoi vous avez travaillé',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'resumeCoverLetter',
      navigationTitle: {
        default: 'Supporting documents',
        fr: 'CV et lettre de motivation',
      },
      navigationDescription: {
        default: 'Tell us why you are suitable for the position',
        fr: 'Dites-nous pourquoi vous correspondez au poste',
      },
      elements: [
        {
          type: 'file',
          name: 'resume',
          title: {
            default: 'Please upload your resume',
            fr: 'Veuillez télécharger votre CV',
          },
          showPreview: true,
          maxSize: 102400,
          isRequired: true,
        },
        {
          type: 'comment',
          name: 'coverLetter',
          title: {
            default: 'why you are suitable for the position ?',
            fr: 'pourquoi vous convenez pour le poste ?',
          },
          isRequired: true,
        },
      ],
    },
  ],
};
