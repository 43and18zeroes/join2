import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

interface Task {
  title: string;
  description: string;
  category: string;
  dueDate: string;
  priority: string;
  assignedTo: string[];
  subTasks: string[];
  subTasksCompleted: boolean[];
  taskStatus: string;
  taskColumnOrder: string;
  firebaseId: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskDataService {

  allTasksData: Task[] = [];

  constructor(private firestore: AngularFirestore) { }

  setAllTasksDataToVarAndLocal() {
    // this.firestore
    //   .collection('tasks')
    //   .valueChanges()
    //   .subscribe((changes: any) => {
    //     this.allTasksData = changes;
    //     localStorage.removeItem('allTasksData');
    //     localStorage.setItem('allTasksData', JSON.stringify(changes));
    //     console.log('this.allTasksData', this.allTasksData);
    //     console.log('this.allTasksData', typeof this.allTasksData); // obj
    //     console.log('JSON.stringify(changes)', JSON.stringify(changes));
    //     console.log('JSON.stringify(changes)', typeof JSON.stringify(changes)); // str
    //   })

    this.endpointTest();
  }

  async endpointTest() {
    let result = await fetch("http://127.0.0.1:8000/kanban/");
    let resultToText = await result.text();

    console.log('resultToText', resultToText);
    console.log('resultToText', typeof resultToText); // str

    const data = this.convertData(resultToText);
    console.log('data', data);
    console.log('data', typeof data);


    this.allTasksData = data;
        localStorage.removeItem('allTasksData');
        localStorage.setItem('allTasksData', JSON.stringify(resultToText));
  }

  convertData(dataString: string): Task[] {
    const data = JSON.parse(dataString);
    return data.map((item: any) => {
      return {
        ...item,
        assignedTo: JSON.parse(item.assignedTo.replace(/'/g, '"')),
        subTasks: JSON.parse(item.subTasks.replace(/'/g, '"')),
        subTasksCompleted: JSON.parse(item.subTasksCompleted.replace(/False/g, 'false').replace(/True/g, 'true').replace(/'/g, '"'))
      };
    });
  }

  getTasksDataMain() {
    if (!this.allTasksData) {
      this.allTasksData = JSON.parse(localStorage.getItem('allTasksData') || '[]');
    }
  }
}