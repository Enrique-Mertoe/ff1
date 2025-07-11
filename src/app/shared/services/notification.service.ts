import { Injectable } from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {NotificationsService} from "angular2-notifications";
import Swal from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar,
              private notificationService: NotificationsService
  ) { }

  public openSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 5000
    });
  }

  // using angular2-notification
  success(title: any, content?: any, override?: any, context?: any) {
    this.notificationService.success(title, content);
  }
  error(title: any, content?: any, override?: any, context?: any) {
    this.notificationService.error(title, content);
  }
  alert(title: any, content?: any, override?: any, context?: any) {
    this.notificationService.alert(title, content);
  }
  warn(title: any, content?: any, override?: any, context?: any) {
    this.notificationService.warn(title, content);
  }
  info(title: any, content?: any, override?: any, context?: any) {
    this.notificationService.info(title, content);
  }
  bare(title: any, content?: any, override?: any, context?: any) {
    this.notificationService.bare(title, content);
  }
  create(title: any, content: any = '', type: string = 'success', override?: any, context?: any) {}
  html(html: any, type: string = 'success', override?: any, icon: string = 'bare', context?: any) {}
  remove(id?: string) {}

  coreSuccess(title: string = 'Success', message: string): void  {
    Swal.fire(title, message, 'success').then( () => {});
  }
  coreError(title: string = 'Error', message: string): void  {
    Swal.fire(title, message, 'error').then( () => {});
  }
  coreWarning(title: string = 'Warning!', message: string): void  {
    Swal.fire(title, message, 'warning').then( () => {});
  }
  async coreInformation(title: string = 'Info', message: string)  {
    return await Swal.fire(title, message, 'info').then( (res) => {
      if(res.isConfirmed) {
        return true;
      } else {
        return false;
      }
    });
  }
  // className: '', closeOnClickOutside: false, closeOnEsc: false, content: undefined, timer: 0,
  async coreConfirm(title: string = 'Are you sure?', message: string = 'Are you sure you want to delete this item?', buttonsText=["Yes", "Cancel"]) {
    return await Swal.fire({
      title,
      icon: 'warning',
      html: message,
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      focusCancel: true,
      confirmButtonText: buttonsText[0],
      cancelButtonText: buttonsText[1],
      allowOutsideClick: false,
      allowEscapeKey: true,
      allowEnterKey: false,
      reverseButtons: false,
      confirmButtonColor: '#51A351',
      // cancelButtonColor: '#9e9e9e',
      // buttonsStyling: false
    })
      .then((result) => {
        if (result.isConfirmed) {
          // used if cos it might return null when closed by other means
          return true;
        } else {
          return false;
        }
      });
  }
  coreSuccessWithTimeout(title: string = 'Success', message: string, timespan: number = 3000): void  {
    Swal.fire({title, html: message, icon: 'success', timer: timespan}).then( () => {});
  }
  coreErrorWithTimeout(title: string = 'Error!', message: string, timespan: number = 3000): void  {
    Swal.fire({title, html: message, icon: 'error', timer: timespan}).then( () => {});
  }
  coreWarningTimeout(title: string = 'Warning!', message: string, timespan: number = 3000): void {
    Swal.fire({title, html: message, icon: 'warning', timer: timespan}).then( () => {});
  }
  coreInformationTimeout(title: string = 'Info', message: string, timespan: number = 3000): void  {
    Swal.fire({title, html: message, icon: 'info', timer: timespan}).then( () => {});
  }
}
