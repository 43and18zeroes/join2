export class User {
    public userName: string;
    public userFirstName: string;
    public userSurName: string;
    public userEmailAddress: string;

    constructor() {
        this.userName = this.userName;
        this.userFirstName = this.userFirstName;
        this.userSurName = this.userSurName;
        this.userEmailAddress = this.userEmailAddress;
    }

    public toJSON() {
        return {
            userName: this.userName,
            userFirstName: this.userFirstName,
            userSurName: this.userSurName,
            userEmailAddress: this.userEmailAddress,
        }
    }
}
