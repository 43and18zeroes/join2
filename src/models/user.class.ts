export class User {
    public userName: string;
    public userFirstName: string;
    public userEmailAddress: string;

    constructor() {
        this.userName = this.userName;
        this.userFirstName = this.userFirstName;
        this.userEmailAddress = this.userEmailAddress;
    }

    public toJSON() {
        return {
            userName: this.userName,
            userFirstName: this.userFirstName,
            userEmailAddress: this.userEmailAddress,
        }
    }
}
