import { Injectable, Renderer2 } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  private renderer: Renderer2;
  isAndroid: boolean = false;
  isiPhone: boolean = false;

  constructor() {
    console.log('device service');
    const userAgent = navigator.userAgent;
    this.isAndroid = /Android/i.test(userAgent);
    this.isiPhone =
      /iPhone|iPad|iPod/i.test(userAgent) || /iOS/i.test(userAgent);

    if (this.isAndroid) {
      console.log('android 2025-06-02');
      // this.renderer.addClass(authFooter, 'android__footer');
    }
    if (this.isiPhone) {
      console.log('iphone 2025-06-02');
      // this.renderer.addClass(authFooter, 'iphone__footer');
    }
  }
}
