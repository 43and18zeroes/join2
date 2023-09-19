import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalStorageService {

  allUsersData: any;
  currentUserAuth: any;
  currentUserData: any[] = [];
  currentUserName: string;

  constructor() { }

}