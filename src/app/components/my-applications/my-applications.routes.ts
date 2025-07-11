import {Routes} from "@angular/router";
import {MyApplicationsComponent} from "./my-applications.component";
import {ApplicationDocumentsComponent} from "./application-documents/application-documents.component";
import {CreateComponent} from "./create/create.component";
import {
  CreateApplicationDocumentComponent
} from "./application-documents/create-application-document/create-application-document.component";
import {MyLicensesComponent} from "./my-licenses/my-licenses.component";
import {CreateLicenseComponent} from "./my-licenses/create-license/create-license.component";

export const MY_APPLICATIONS_ROUTES: Routes = [
  {
    path: '',
    component: MyApplicationsComponent,
    data: {
      title: 'My applications',
      breadcrumb: [
        {
          label: 'My applications',
          url: ''
        }
      ]
    }
  },
  {
    path: 'create',
    component: CreateComponent,
    data: {
      title: 'My Application',
      breadcrumb: [
        {
          label: 'My Application',
          url: '/my-applications'
        },
        {
          label: '{{action}} application',
          url: ''
        }
      ]
    }
  },
  {
    path: 'edit/:id',
    component: CreateComponent,
    data: {
      title: 'My Application',
      breadcrumb: [
        {
          label: 'My Application',
          url: '/my-applications'
        },
        {
          label: '{{action}} application',
          url: ''
        }
      ]
    }
  },
  {
    path: 'documents',
    component: ApplicationDocumentsComponent,
    data: {
      title: 'Application documents',
      breadcrumb: [
        {
          label: 'Application documents',
          url: ''
        }
      ]
    },
    children: [
      {
        path: 'create',
        component: CreateApplicationDocumentComponent,
        data: {
          title: 'My Application',
          breadcrumb: [
            {
              label: 'Application documents',
              url: '/my-applications/documents'
            },
            {
              label: '{{action}} document',
              url: ''
            }
          ]
        }
      },
      {
        path: 'edit/:id',
        component: CreateApplicationDocumentComponent,
        data: {
          title: 'My Application',
          breadcrumb: [
            {
              label: 'Application documents',
              url: '/my-applications/documents'
            },
            {
              label: '{{action}} document',
              url: ''
            }
          ]
        }
      },
    ]
  },
  {
    path: 'my-licenses',
    component: MyLicensesComponent,
    data: {
      title: 'My licenses',
      breadcrumb: [
        {
          label: 'My licenses',
          url: ''
        }
      ]
    },
    children: [
      {
        path: 'create',
        component: CreateLicenseComponent,
        data: {
          title: 'My licenses',
          breadcrumb: [
            {
              label: 'My licenses',
              url: '/my-applications/my-licenses'
            },
            {
              label: '{{action}} license',
              url: ''
            }
          ]
        }
      },
      {
        path: 'edit/:id',
        component: CreateLicenseComponent,
        data: {
          title: 'My licenses',
          breadcrumb: [
            {
              label: 'My licenses',
              url: '/my-applications/my-licenses'
            },
            {
              label: '{{action}} license',
              url: ''
            }
          ]
        }
      },
    ]
  }
]
