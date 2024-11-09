import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BackendUserDataService {

  userAddedSuccessfully = false;
  lastUserAdded: Object;
  lastUserAddedId: number;

  constructor() {}

}
