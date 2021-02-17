import {IframeMessage} from '../message';

export class RegisteredMessage extends IframeMessage {
    action = 'Registered';

    constructor(result: boolean) {
        super({result});
    }
}
