export class Contact {
    public contactName: string;
    public contactFirstName: string;
    public contactSurName: string;
    public contactInitials: string;
    public contactEmailAddress: string;
    public contactPhoneNumber: string;
    public contactColor: string;

    constructor() {
        this.contactName = this.contactName;
        this.contactFirstName = this.contactFirstName;
        this.contactSurName = this.contactSurName;
        this.contactInitials = this.contactInitials;
        this.contactEmailAddress = this.contactEmailAddress;
        this.contactPhoneNumber = this.contactPhoneNumber;
        this.contactColor = this.contactColor;
    }

    public toJSON() {
        return {
            contactName: this.contactName,
            contactFirstName: this.contactFirstName,
            contactSurName: this.contactSurName,
            contactInitials: this.contactInitials,
            contactEmailAddress: this.contactEmailAddress,
            contactPhoneNumber: this.contactPhoneNumber,
            contactColor: this.contactColor
        }
    }
}