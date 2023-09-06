export class UserData {
    private userName: string;
    private userEmailAddress: string;
    private userPassword: string;

    constructor(obj: UserData) {
        this.userName = obj.userName;
        this.userEmailAddress = obj.userEmailAddress;
        this.userPassword = obj.userPassword;
    }
}