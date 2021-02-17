export class Service {
    constructor(public name: string) {
    }

    getDomain(): string {
        return `http://${this.name}`;
    }
}
