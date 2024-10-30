import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class TaskDataService {

  allTasksData;

  constructor(private firestore: AngularFirestore) { }

  setAllTasksDataToVarAndLocal() {
    // this.firestore
    //   .collection('tasks')
    //   .valueChanges()
    //   .subscribe((changes: any) => {
    //     this.allTasksData = changes;
    //     localStorage.removeItem('allTasksData');
    //     localStorage.setItem('allTasksData', JSON.stringify(changes));
    //   })

      this.endpointTest();
  }

  async endpointTest() {
    const result = await fetch("http://127.0.0.1:8000/kanban/");
    const resultToText = await result.text();
    console.log('resultToText', resultToText);
    // localStorage.removeItem('allTasksData');
    // localStorage.setItem('allTasksData', JSON.stringify(resultToText));
  }

  getTasksDataMain() {
    if (!this.allTasksData) {
      this.allTasksData = JSON.parse(localStorage.getItem('allTasksData') || '[]');
    }
  }
}
