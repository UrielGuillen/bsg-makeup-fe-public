import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import Swal, { SweetAlertIcon, SweetAlertOptions, SweetAlertResult } from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly defaultNotificationTitles: {
    [key in SweetAlertIcon]: string;
  } = {
      error: 'ALERTS.TITLES.ERROR',
      info: 'ALERTS.TITLES.INFO',
      success: 'ALERTS.TITLES.SUCCESS',
      warning: 'ALERTS.TITLES.WARNING',
      question: '',
    };

  private readonly defaultOptionsSwal: SweetAlertOptions = {
    showCancelButton: true,
    allowEscapeKey: false,
    allowOutsideClick: false,
    allowEnterKey: false,
  };

  constructor(private translateService: TranslateService) {
  }

  public showToast(config: { message: string; type: SweetAlertIcon }): void {
    const { message, type }: { message: string; type: SweetAlertIcon } = config;
    // eslint-disable-next-line @typescript-eslint/typedef
    const Toast = Swal.mixin({
      toast: true,
      position: 'bottom',
      showConfirmButton: false,
      timer: 3000,
      icon: type,
      title: this.translateService.instant(message),
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });

    Toast.fire();
  }

  public showNotification(config: { message?: string; title?: string; type: SweetAlertIcon }): void {
    const { type }: { message?: string; title?: string; type: SweetAlertIcon } = config;

    const options: SweetAlertOptions = {
      ...this.defaultOptionsSwal,
      title: this.getTitle(config.type, config.title),
      icon: type,
      showCancelButton: false,
      confirmButtonText: this.translateService.instant('ALERTS.TITLES.ACCEPT'),
    };

    if (config.message) {
      options.text = this.translateService.instant(config.message);
    }

    Swal.fire(options);
  }

  public confirm(config: { message?: string; title?: string; showCancelButton?: boolean; type?: SweetAlertIcon }): Observable<SweetAlertResult> {
    const {
      message,
      title,
      showCancelButton,
      type,
    }: {
      message?: string;
      title?: string;
      showCancelButton?: boolean;
      type?: SweetAlertIcon;
    } = config;
    const showCloseButton: boolean = showCancelButton === undefined ? true : showCancelButton;

    const options: SweetAlertOptions = {
      ...this.defaultOptionsSwal,
      title: this.getTitle('warning', title),
      text: message,
      icon: type || 'warning',
      cancelButtonText: this.translateService.instant('COMMON.CANCEL'),
      confirmButtonText: this.translateService.instant('COMMON.ACCEPT'),
      showCancelButton: showCloseButton,
    };

    if (config.message) {
      options.text = this.translateService.instant(config.message);
    }

    return from(Swal.fire(options));
  }

  private getTitle(type: SweetAlertIcon, title?: string): string {
    if (title) {
      return this.translateService.instant(title);
    }

    return this.translateService.instant(this.defaultNotificationTitles[type]);
  }
}
