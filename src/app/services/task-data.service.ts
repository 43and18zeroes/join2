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

  // convertSubTasksCompleted = (dataObject) =>
  //   dataObject.map((task) => {
  //     if (task.subTasksCompleted === 'True') {
  //       task.subTasksCompleted = true;
  //     } else if (task.subTasksCompleted === 'False') {
  //       task.subTasksCompleted = false;
  //     }
  //     return task;
  //   });

  convertSubTasksCompletedToLowerCase(tasks) {
    return tasks.map(task => {
      if (task.subTasksCompleted) {
        // Entferne die eckigen Klammern und teile die Zeichenkette in ein Array auf
        let subTasksArray = task.subTasksCompleted.slice(1, -1).split(", ");
  
        // Konvertiere jedes Element in einen Boolean
        subTasksArray = subTasksArray.map(value => value.toLowerCase() === "true");
  
        // Speichere das Array wieder im Objekt
        task.subTasksCompleted = subTasksArray;
      }
      return task;
    });
  }

  async endpointTest() {
    const downloadedData = await fetch('http://127.0.0.1:8000/kanban/');
    let dataObject = await downloadedData.json();
    console.log('dataObject', dataObject);
    // dataObject = this.convertSubTasksCompletedToLowerCase(dataObject);

    // dataObject.subTasksCompleted = dataObject.subTasksCompleted.toLowerCase();

    // console.log('dataObject', dataObject);
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
