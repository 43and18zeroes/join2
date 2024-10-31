import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class TaskDataService {
  allTasksData;

  constructor(private firestore: AngularFirestore) {}

  setAllTasksDataToVarAndLocal() {
    // this.firestore
    //   .collection('tasks')
    //   .valueChanges()
    //   .subscribe((changes: any) => {
    //     this.allTasksData = changes;
    //     console.log('this.allTasksData', this.allTasksData);
    //     localStorage.removeItem('allTasksData');
    //     localStorage.setItem('allTasksData', JSON.stringify(changes));
    //   })

    this.endpointTest();
  }

  async endpointTest() {
    const downloadedData = await fetch('http://127.0.0.1:8000/kanban/');
    let dataObject = await downloadedData.json();
    console.log('dataObject', dataObject);
    this.allTasksData = dataObject;
    localStorage.removeItem('allTasksData');
    localStorage.setItem('allTasksData', JSON.stringify(dataObject));
  }

  getTasksDataMain() {
    if (!this.allTasksData) {
      this.allTasksData = JSON.parse(
        localStorage.getItem('allTasksData') || '[]'
      );
    }
  }
}
