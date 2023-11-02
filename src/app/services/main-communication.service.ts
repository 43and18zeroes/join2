import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainCommunicationService {
  private displaySection = new BehaviorSubject('default');

  constructor() { }

  // Andere Komponenten können dieses Observable abonnieren
  get displaySectionObservable() {
    return this.displaySection.asObservable();
  }

  // Diese Methode benachrichtigt alle Abonnenten über die Änderung
  displayMainSection(section) {
    this.displaySection.next(section);
  }
}
