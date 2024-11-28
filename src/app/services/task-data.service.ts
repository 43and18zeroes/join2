import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class TaskDataService {
  allTasksData;

  constructor(private firestore: AngularFirestore) {}

  async setAllTasksDataToVarAndLocal() {
    const downloadedData = await fetch('http://127.0.0.1:8000/kanban/');
    let dataObject = await downloadedData.json();
    this.parseData(dataObject);
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

  private parseData(dataObject: any[]) {
    dataObject.forEach((item) => {
      let jsonString = item.assignedTo.replace(/'/g, '"');
      item.assignedTo = JSON.parse(jsonString);
      let subTasksJsonString = item.subTasks.replace(/'/g, '"');
      item.subTasks = JSON.parse(subTasksJsonString);

      if (typeof item.subTasksCompleted === 'string') {
        let subTasksCompletedJsonString = item.subTasksCompleted
          .replace(/False/g, 'false')
          .replace(/True/g, 'true');
        item.subTasksCompleted = JSON.parse(subTasksCompletedJsonString);
      }
    });
  }
}