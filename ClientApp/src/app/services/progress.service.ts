import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { XhrFactory } from '@angular/common/';

@Injectable()
export class ProgressService {
  private uploadProgress: Subject<any> = new Subject();
  public downloadProgress: Subject<any> = new Subject();
  stratTraking() {
    this.uploadProgress = new Subject();
    return this.uploadProgress;
  }
  notify(progress: any) {
    if (this.uploadProgress) this.uploadProgress.next(progress);
  }
  endTracking() {
    if (this.uploadProgress) this.uploadProgress.complete();
  }
}
@Injectable()
export class BrowserXhrWithProgress extends XhrFactory {
  constructor(private service: ProgressService) {
    super();
  }
  build(): XMLHttpRequest {
    var xhr: XMLHttpRequest = new XMLHttpRequest();
    xhr.onprogress = (event) => {
      this.service.downloadProgress.next(this.createProgress(event));
    };
    xhr.upload.onprogress = (event) => {
      this.service.notify(this.createProgress(event));
    };
    xhr.upload.onloadend = () => {
      this.service.endTracking();
    };
    return xhr;
  }
  private createProgress(event: any) {
    return {
      total: event.total,
      percentage: Math.round((event.loaded / event.total) * 100),
    };
  }
}
