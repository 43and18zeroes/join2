import { Component, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { DeviceService } from './services/device.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  firestore: Firestore = inject(Firestore);

  constructor(private deviceService: DeviceService) {

  }
}
