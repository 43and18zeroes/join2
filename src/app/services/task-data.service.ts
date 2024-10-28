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
        console.log('this.allTasksData', typeof this.allTasksData); // obj
        console.log('JSON.stringify(changes)', JSON.stringify(changes));
        console.log('JSON.stringify(changes)', typeof JSON.stringify(changes)); // str
      })

      this.endpointTest()
  }

  async endpointTest() {
    let result = await fetch("http://127.0.0.1:8000/kanban/");
    let resultToText = await result.text()

    // const formattedString = resultToText.replace(/'(\w+@[\w.]+)'/g, '"$1"') // Wandelt 'email' in "email" um
    //                                .replace(/'\[(.*?)\]'/g, '[$1]')   // Wandelt '["..."]' in ["..."] um
    //                                .replace(/'/g, '"');               // Wandelt übrige ' in " um
    // // Parsen des Strings als JSON
    // const data = JSON.parse(formattedString);
    // console.log('data', data);
    // console.log('data', typeof data);

    console.log('resultToText', resultToText);
    console.log('resultToText', typeof resultToText); // str

  }

  getTasksDataMain() {
    if (!this.allTasksData) {
      this.allTasksData = JSON.parse(localStorage.getItem('allTasksData') || '[]');
    }
  }
}
