import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

// document.addEventListener('DOMContentLoaded', () => {
//   const isAndroid = /Android/i.test(navigator.userAgent);
//   if (isAndroid) {
//     const appMain = document.getElementsByTagName('app-main')[0];
//     if (appMain) {
//       appMain.classList.add('android__height');
//     }
//   }
// });

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
