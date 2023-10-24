export class User {
    public userName: string;
    public userFirstName: string;
    public userSurName: string;
    public userInitials: string;
    public userEmailAddress: string;
    public userColor: string;
    public userPhoneNumber: string;
    public type: string;
    public firebaseId: string;

    constructor() {
        this.userName = this.userName;
        this.userFirstName = this.userFirstName;
        this.userSurName = this.userSurName;
        this.userInitials = this.userInitials;
        this.userEmailAddress = this.userEmailAddress;
        this.userColor = this.userColor;
        this.userPhoneNumber = this.userPhoneNumber;
        this.type = this.type;
        this.firebaseId = this.firebaseId;
    }

    public toJSON() {
        return {
            userName: this.userName,
            userFirstName: this.userFirstName,
            userSurName: this.userSurName,
            userInitials: this.userInitials,
            userEmailAddress: this.userEmailAddress,
            userColor: this.userColor,
            userPhoneNumber: this.userPhoneNumber,
            type: this.type,
            firebaseId: this.firebaseId
        }
    }
}
