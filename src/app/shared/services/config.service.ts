import {Injectable, Injector} from '@angular/core';
import {DataService} from "./data.service";
import {ApiService} from "./api.service";
import {SysConfig} from "../schema/sys-config";
import {NotificationService} from "./notification.service";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  dataService: DataService;
  apiService: ApiService;
  constructor(private injector: Injector) { }

  async getAllConfigurations(): Promise<SysConfig> {
    this.apiService = this.injector.get(ApiService);
    return await this.apiService.api<SysConfig>('GET', `/configs/${environment.systemId}`);
  }

  async load() {
    this.dataService = this.injector.get(DataService);
    const notificationService: NotificationService = this.injector.get(NotificationService);
    await this.getAllConfigurations().then(
      (result: SysConfig) => {
        this.dataService.setConfig(result);
        this.addFavicon(result.favicon);
      },
      (error) => {
        notificationService.coreError('Error', 'Could not load system settings. Check internet connection.');
        console.log(error);
      }
    );
  }

  addFavicon(icon: string): void {
    // add favicon based on shop name
    const link: any = document.querySelector('link[rel*=\'icon\']') || document.createElement('link');
    const title: any = document.getElementsByTagName('title')[0] || document.createElement('title');
    title.text = this.dataService.config.systemName;
    const iconExt = icon.split('.')[1];
    if (iconExt === 'ico') {
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
    } else {
      link.type = 'image/' + iconExt;
      link.rel = 'icon';
      // link.sizes = '32x32';
      link.sizes = '16x16';
    }
    link.href = this.dataService.getThumb(icon, false);
    document.getElementsByTagName('head')[0].appendChild(link);
    document.getElementsByTagName('head')[0].appendChild(title);
  }
}
export function ConfigLoader(configService: ConfigService) {
  return () => configService.load();
}
