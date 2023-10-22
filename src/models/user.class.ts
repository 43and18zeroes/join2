export class User {
    public userName: string;
    public userFirstName: string;
    public userSurName: string;
    public userInitials: string;
    public userEmailAddress: string;
    public userColor: string;
    public type: string;

    constructor() {
        this.userName = this.userName;
        this.userFirstName = this.userFirstName;
        this.userSurName = this.userSurName;
        this.userInitials = this.userInitials;
        this.userEmailAddress = this.userEmailAddress;
        this.userColor = this.userColor;
        this.type = this.type;
    }

    public toJSON() {
        return {
            userName: this.userName,
            userFirstName: this.userFirstName,
            userSurName: this.userSurName,
            userInitials: this.userInitials,
            userEmailAddress: this.userEmailAddress,
            userColor: this.userColor,
            type: this.type,
        }
    }
}
