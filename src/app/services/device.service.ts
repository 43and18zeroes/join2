import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  private renderer: Renderer2;
  isAndroid: boolean = false;
  isiPhone: boolean = false;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    const userAgent = navigator.userAgent;
    this.isAndroid = /Android/i.test(userAgent);
    this.isiPhone =
      /iPhone|iPad|iPod/i.test(userAgent) || /iOS/i.test(userAgent);
  }

  applyDeviceClassesToFooter(): void {
    const mainFooter = document.getElementById('main-footer');

    if (mainFooter) {
      if (this.isAndroid) {
        const mainSection = document.getElementById('main-section');
        mainSection.classList.add('android__height');

      }
      if (this.isiPhone) {
        this.renderer.addClass(mainFooter, 'iphone__footer');
      }
    }
  }
}