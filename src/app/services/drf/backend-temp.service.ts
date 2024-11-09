// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class BackendTempService {

//   private itemsSubject = new BehaviorSubject<any[]>([]);
//   items$ = this.itemsSubject.asObservable();

//   constructor() { }

//   setItems(items: any[]) {
//     this.itemsSubject.next(items);
//   }

//   getItems(): any[] {
//     return this.itemsSubject.getValue();
//   }
// }