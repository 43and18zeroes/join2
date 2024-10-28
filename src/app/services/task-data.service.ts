import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class TaskDataService {

  allTasksData;

  constructor(private firestore: AngularFirestore) { }

  setAllTasksDataToVarAndLocal() {
    this.firestore
      .collection('tasks')
      .valueChanges()
      .subscribe((changes: any) => {
        this.allTasksData = changes;
        localStorage.removeItem('allTasksData');
        localStorage.setItem('allTasksData', JSON.stringify(changes));
        console.log('this.allTasksData', this.allTasksData);
        console.log('this.allTasksData', typeof this.allTasksData);
        console.log('JSON.stringify(changes)', JSON.stringify(changes));
        console.log('JSON.stringify(changes)', typeof JSON.stringify(changes));
      })
  }

  getTasksDataMain() {
    if (!this.allTasksData) {
      this.allTasksData = JSON.parse(localStorage.getItem('allTasksData') || '[]');
    }
  }
}
