import { Injectable } from '@angular/core';
import {MenuItem} from "../models/menu-item";
import {SysConfig} from "../schema/sys-config";
import {SortDirection} from "@angular/material/sort";
import {AngularEditorConfig} from "@kolkov/angular-editor";
// export type LicenseType={
//   license_type_id: string;
//   name: string;
// }

@Injectable({
  providedIn: 'root'
})
export class DataService {
  config: SysConfig = null;
  // to be used as a final check if image not available, and placeholder not defined
  placeholderImage = '/assets/images/image-placeholder.jpg';
  placeholderImageAlt = '/assets/images/placeholder.png';
  sysImagePlaceholder = `url(${this.placeholderImage})`;
  menu: MenuItem[] = [
    {
      id: 'home',
      text: 'Home',
      icon: 'home',
      link : '/home',
      // global: true
    },
    {
      id: 'dashboard',
      text: 'Dashboard',
      icon: 'dashboard',
      link : '/dashboard',
      // global: true
    },
    {
      id: 'my-applications',
      text: 'My applications',
      icon: 'list',
      link : '/my-applications',
      // global: true
    },
    {
      id: 'workflow',
      text: 'Workflow Tasks',
      icon: 'assignment_turned_in',
      link : '/workflow',
      // global: true
    },
    {
      id: 'application-docs',
      text: 'Application documents',
      icon: 'file_present',
      link : 'my-applications/documents',
      // global: true
    },
    {
      id: 'my-licenses',
      text: 'My licenses',
      icon: 'featured_play_list',
      link : 'my-applications/my-licenses',
      // global: true
    },
    {
      id: 'applications-core',
      text: 'Applications',
      icon: 'cases',
      link: '/admin',
      children: [
        {
          id: 'all-applications',
          text: 'All Applications',
          icon: 'list_alt',
          link: '/admin/all-applications'
        },
        {
          id: 'drafts',
          text: 'Drafts',
          icon: 'drafts',
          link: '/admin/drafts'
        }
      ]
    },
    {
      id: 'users-core',
      text: 'Users',
      icon: 'manage_accounts',
      link: '/users',
      children: [
        {
          id: 'user-accounts',
          text: 'User accounts',
          icon: 'person_add',
          link: '/users'
        },
        {
          id: 'authorization',
          text: 'Authorization',
          icon: 'verified_user',
          link: '/users/authorization'
        },
        // {
        //   id: 'account-activations',
        //   text: 'Account activation',
        //   icon: 'security',
        //   link: '/users/account-activations'
        // },
        {
          id: 'user-groups',
          text: 'User groups',
          icon: 'group',
          link: '/users/user-roles'
        }
      ]
    },
    {
      id: 'reports-core',
      text: 'Reports',
      icon: 'leaderboard',
      link: '/reports',
      children: [
        {
          id: 'water-permits',
          text: 'Water permits',
          icon: 'list',
          link: '/reports/water-permits'
        },
        {
          id: 'water-permits-distribution',
          text: 'Water Permits Distribution',
          icon: 'auto_graph',
          link: '/reports/water-permits-distribution'
        },
        {
          id: 'water-allocation-level',
          text: 'Water Allocation Level',
          icon: 'water',
          link: '/reports/water-allocation-level'
        },
        {
          id: 'water-use-distribution',
          text: 'Water Use Distribution',
          icon: 'water_drop',
          link: '/reports/water-use-distribution'
        },
        {
          id: 'largest-water-users',
          text: 'Largest Water Users',
          icon: 'incomplete_circle',
          link: '/reports/largest-water-users'
        },
        {
          id: 'water-discharge-distribution',
          text: 'Water Discharge Distribution',
          icon: 'water_damage',
          link: '/reports/water-discharge-distribution'
        },
        {
          id: 'largest-water-discharge',
          text: 'Largest Water Discharge',
          icon: 'waterfall_chart',
          link: '/reports/largest-water-discharge'
        },
        {
          id: 'water-licence-revenue-distribution',
          text: 'Water Licence Revenue Distribution',
          icon: 'pie_chart',
          link: '/reports/water-licence-revenue-distribution'
        },
        {
          id: 'largest-revenue-licences',
          text: 'Largest Revenue Licences',
          icon: 'attach_money',
          link: '/reports/largest-revenue-licences'
        },
        {
          id: 'largest-debt-holders',
          text: 'Largest Debt Holders',
          icon: 'money_off',
          link: '/reports/largest-debt-holders'
        },
        {
          id: 'water-licence-debt-distribution',
          text: 'Water Licence Debt Distribution',
          icon: 'storage',
          link: '/reports/water-licence-debt-distribution'
        }
      ]
    },
    {
      id: 'workflow-core',
      text: 'Workflow',
      icon: 'assignment',
      link: '/workflow',
      children: [
        {
          id: 'workflow',
          text: 'My Tasks',
          icon: 'task_alt',
          link: '/workflow'
        },
        {
          id: 'licensing-officer',
          text: 'Licensing Officer',
          icon: 'engineering',
          link: '/licensing-officer'
        },
        {
          id: 'accountant',
          text: 'Accountant',
          icon: 'account_balance',
          link: '/accountant'
        }
      ]
    },
    {
      id: 'approvals-core',
      text: 'Approvals',
      icon: 'checklist',
      link: '/approvals',
      children: [
        {
          id: 'new-approvals',
          text: 'New approvals',
          icon: 'mark_email_unread',
          link: '/approvals/new-approvals'
        },
        {
          id: 'recent-approvals',
          text: 'Recent approvals',
          icon: 'history',
          link: '/approvals/recent-approvals'
        }
      ]
    },
    {
      id: 'configurations-core',
      text: 'System configurations',
      icon: 'settings',
      link: '/system',
      children: [
        {
          id: 'configuration',
          text: 'Sys config',
          icon: 'build',
          link: '/system/configurations'
        },
        {
          id: 'sys-audit-entries',
          text: 'Audit entries',
          icon: 'content_copy',
          link: '/system/sys-audit-entries'
        },
        {
          id: 'system-object',
          text: 'System objects',
          icon: 'dialpad',
          link: '/system/sys-objects'
        },
        {
          id: 'sys-permissions',
          text: 'Sys permissions',
          icon: 'block',
          link: '/system/sys-permissions'
        },
        {
          id: 'sys-email-templates',
          text: 'Email templates',
          icon: 'email_draft',
          link: '/system/sys-email-templates'
        },
        {
          id: 'sys-account-status',
          text: 'Account statuses',
          icon: 'settings_power',
          link: '/system/sys-account-status'
        }
      ]
    },
    {
      id: 'user-profile',
      text: 'My profile',
      icon: 'person',
      link: '/account/profile',
      global: true
    },
    {
      id: 'help',
      text: 'Help',
      icon: 'help',
      link: '/account/help',
      global: true
    }
  ];

  constructor() { }
  setConfig(config: SysConfig) {
    this.config = config;
  }
  getUrl(url: string) {
    if (url.includes('localhost')) {
      const arr = this.config.systemUrl.split('/'); // window.location.href.replace(':4200', '').split('/');
      const path = url.split('localhost')[1] || '';
      return  arr[0] + '//' + arr[2] + path;
    }
    return url;
  }
  getThumb(url: string | any, css = true): string{
    if (typeof url !== 'string') {
      // check if a thumb is set, or take first image in the array, if no image, use defined placeholder from db, else sys placeholder
      const coverImage = url.productImages.find(it => it.thumbnail === 1) || url.productImages[0] ||
        this.config.notFoundImage || this.sysImagePlaceholder;
      url = typeof coverImage !== 'string' ? coverImage.url : '';
    }
    return css ? `url(${this.getUrl(url)})` : `${this.getUrl(url)}`;
  }
  get(key: string) {
    const item = localStorage.getItem(key);
    return item ? (key === 'token') ? item : JSON.parse(item) : null;
  }
  set(key: string, value: any) {
    localStorage.setItem(key, typeof  value === 'string' ? value : JSON.stringify(value));
  }
  remove(key: string) {
    localStorage.removeItem(key);
  }
  async logout() {
    localStorage.clear();
  }
}
export const   errorMessages = {
  usernameExists: 'Username already taken',
  emailExists: 'Email already registered under another account.\nReset password if forgotten?',
  phoneNumberExists: 'Mobile number already registered under another account.\nReset password if forgotten?',
  passwordNotMatching: 'Passwords do not match.',
  mustMatch: 'Passwords do not match.',
  passwordStrength: 'Password, be alphanumeric with at least one uppercase',
  invalidPassword: 'Invalid password'

};
export const imageTypes = [
  'image/jpg',
  'image/jpeg',
  'image/png'
];
export const documentTypes = [
  'application/pdf'
];
export const editorConfig: AngularEditorConfig = {
  editable: true,
  sanitize: false,
  spellcheck: true,
  height: 'auto',
  minHeight: '5rem',
  maxHeight: 'auto',
  width: 'auto',
  minWidth: '0',
  translate: 'yes',
  enableToolbar: true,
  showToolbar: true,
  placeholder: 'Enter text here...',
  defaultParagraphSeparator: 'p',
  // defaultFontName: 'Merriweather Sans',
  defaultFontName: 'Avenir Medium',
  defaultFontSize: '4',
  fonts: [
    {class: 'Avenir Medium', name: 'Avenir Medium'},
    {class: 'Avenir Black', name: 'Avenir Black'},
    {class: 'Merriweather Sans', name: 'Merriweather Sans'},
    {class: 'sans-serif', name: 'sans-serif'},
    {class: 'arial', name: 'Arial'},
    {class: 'times-new-roman', name: 'Times New Roman'},
    {class: 'calibri', name: 'Calibri'},
    {class: 'comic-sans-ms', name: 'Comic Sans MS'}
  ],
  toolbarHiddenButtons: [
    // ['bold']
  ],
  customClasses: [
    {
      name: "quote",
      class: "quote",
    },
    {
      name: 'redText',
      class: 'redText'
    },
    {
      name: "titleText",
      class: "titleText",
      tag: "h1",
    },
  ]
};
export function isEmpty(obj) {
  // ES5 support
  return obj && Object.keys(obj).length === 0;
}

export function sortArray(array: any[], key: any, direction: SortDirection) {
  return array.sort(function(a, b) {
    const x = a[key]; const y = b[key];
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });
}
