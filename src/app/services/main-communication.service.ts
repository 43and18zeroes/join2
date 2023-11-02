import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainCommunicationService {
  private displayBoard = new BehaviorSubject('default');

  constructor() { }

  // Andere Komponenten können dieses Observable abonnieren
  get displayBoardObservable() {
    return this.displayBoard.asObservable();
  }

  // Diese Methode benachrichtigt alle Abonnenten über die Änderung
  displayMainBoard(board) {
    this.displayBoard.next(board);
  }
}
