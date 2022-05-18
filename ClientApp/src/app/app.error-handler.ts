import * as Raven from 'raven-js';
import { ToastyService } from 'ng2-toasty';
import {
  ErrorHandler,
  Inject,
  Injectable,
  NgZone,
  isDevMode,
} from '@angular/core';

@Injectable()
export class AppErrorHandler implements ErrorHandler {
  constructor(
    private NgZone: NgZone,
    @Inject(ToastyService) private toastyService: ToastyService
  ) {}
  handleError(error: any): void {
    this.NgZone.run(() => {
      console.log(error);
      this.toastyService.error({
        title: 'Error',
        msg: 'An unexpected error happened.',
        theme: 'default',
        showClose: true,
        timeout: 5000,
      });
    });
    if (!isDevMode) Raven.captureException(error.originalError || error);
    else throw error;
  }
}
