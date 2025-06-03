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

    // HINWEIS: Hier KEINE DOM-Manipulationen mehr!
    // Die Erkennung des Gerätyps ist hier aber weiterhin in Ordnung.
  }

  // Neue Methode zur Anwendung von CSS-Klassen
  applyDeviceClassesToFooter(): void {
    const mainFooter = document.getElementById('main-footer');

    if (mainFooter) { // Wichtig: Prüfen, ob das Element existiert!
      if (this.isAndroid) {
        console.log('android 2025-06-02');
        // this.renderer.addClass(mainFooter, 'android__footer');
        const mainSection = document.getElementById('main-section');
        mainSection.classList.add('android__height');

      }
      if (this.isiPhone) {
        console.log('iphone 2025-06-02');
        this.renderer.addClass(mainFooter, 'iphone__footer');
      }
    }
  }
}