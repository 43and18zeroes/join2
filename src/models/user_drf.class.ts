export class User {
    public user_name: string;
    public first_name: string;
    public last_name: string;
    public initials: string;
    public email: string;
    public user_color: string;
    public phone_number: string;
    public type: string;
    public password: string;
    // public firebaseId: string;

    constructor() {
        this.user_name = this.user_name;
        this.first_name = this.first_name;
        this.last_name = this.last_name;
        this.initials = this.initials;
        this.email = this.email;
        this.user_color = this.user_color;
        this.phone_number = this.phone_number;
        this.type = this.type;
        this.password = this.password;
        // this.firebaseId = this.firebaseId;
    }

    public toJSON() {
        return {
            userName: this.user_name,
            first_name: this.first_name,
            last_name: this.last_name,
            initials: this.initials,
            email: this.email,
            user_color: this.user_color,
            phone_number: this.phone_number,
            type: this.type,
            password: this.password,
            // firebaseId: this.firebaseId
        }
    }
}


// export class User {
//     public userName: string;
//     public userFirstName: string;
//     public userSurName: string;
//     public userInitials: string;
//     public userEmailAddress: string;
//     public userColor: string;
//     public userPhoneNumber: string;
//     public type: string;
//     public firebaseId: string;

//     constructor() {
//         this.userName = this.userName;
//         this.userFirstName = this.userFirstName;
//         this.userSurName = this.userSurName;
//         this.userInitials = this.userInitials;
//         this.userEmailAddress = this.userEmailAddress;
//         this.userColor = this.userColor;
//         this.userPhoneNumber = this.userPhoneNumber;
//         this.type = this.type;
//         this.firebaseId = this.firebaseId;
//     }

//     public toJSON() {
//         return {
//             userName: this.userName,
//             userFirstName: this.userFirstName,
//             userSurName: this.userSurName,
//             userInitials: this.userInitials,
//             userEmailAddress: this.userEmailAddress,
//             userColor: this.userColor,
//             userPhoneNumber: this.userPhoneNumber,
//             type: this.type,
//             firebaseId: this.firebaseId
//         }
//     }
// }
