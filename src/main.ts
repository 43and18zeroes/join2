import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

document.addEventListener('DOMContentLoaded', () => {
  const isAndroid = /Android/i.test(navigator.userAgent);
  // const element = document.getElementsByTagName('app-main')[0];
  if (isAndroid) {
    const element = document.getElementsByTagName('app-main')[0];
    if (element) {
      element.classList.add('android__height');
    }
  } else {
    console.log('Anwendung wird nicht auf einem Android-Gerät ausgeführt');
    // const element = document.getElementsByTagName('app-main')[0];
    // element.classList.add('android__height');
  }
});

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
