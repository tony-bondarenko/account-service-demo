export class User {
    public passwordHash: string;

    constructor(public username: string, password: string) {
        // @todo: add bcrypt to hash passwo
        this.passwordHash = password;
    }

    checkPassword(password: string): boolean {
        return this.passwordHash === password;
    }
}
