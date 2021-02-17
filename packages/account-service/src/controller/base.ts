import {Response} from 'express';

import {Service} from 'entity';
import {ApplicationService, UserService} from 'service';
import {IframeMessage} from 'iframe';

export abstract class BaseController {
    protected constructor(
        protected readonly userService: UserService,
        protected readonly appService: ApplicationService
    ) {}

    protected returnIframeMessage(service: Service, message: IframeMessage, res: Response) {
        const serviceDomain = service.getDomain();
        res.setHeader('Content-Security-Policy', `frame-ancestors ${serviceDomain}`);
        return res.render('iframe-response', {
            serviceDomain: serviceDomain,
            messageString: JSON.stringify(message),
        });
    }
}
