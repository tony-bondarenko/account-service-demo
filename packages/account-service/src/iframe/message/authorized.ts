import {IframeMessage} from '../message';

export class AuthorizedMessage extends IframeMessage {
    action = 'Authorized';

    constructor(token: string | null) {
        super({token});
    }
}
