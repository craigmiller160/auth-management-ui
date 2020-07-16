
export default class MessageBuilder {
    constructor(public message: string = '') { }

    append(part?: string): MessageBuilder {
        if (part) {
            return new MessageBuilder(`${this.message} ${part}`);
        }
        return new MessageBuilder(this.message);
    }
}
