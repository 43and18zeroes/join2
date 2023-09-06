export class User {
    userName: string;
    userEmailAddress: string;
    userPassword: string;

    constructor(obj: any) {
        this.userName = obj.userName;
        this.userEmailAddress = obj.userEmailAddress;
        this.userName = obj.userPassword;
    }
}