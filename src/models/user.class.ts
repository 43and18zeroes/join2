export class User {
    public userName: string;
    public userEmailAddress: string;
    public userPassword: string;

    constructor() {
        this.userName = this.userName;
        this.userEmailAddress = this.userEmailAddress;
        this.userPassword = this.userPassword;
    }

    public toJSON() {
        return {
            userName: this.userName,
            userEmailAddress: this.userEmailAddress,
            userPassword: this.userPassword
        }
    }
}