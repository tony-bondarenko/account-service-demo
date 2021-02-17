import {NextFunction, Request, Response} from 'express';
import {Injectable, NestMiddleware} from '@nestjs/common';

import {ApplicationService} from '../service';
import {ServiceRequest} from '../http';

@Injectable()
export class ServiceMiddleware implements NestMiddleware {
    constructor(protected readonly appService: ApplicationService) {}

    use(req: Request & ServiceRequest, res: Response, next: NextFunction) {
        const serviceName = req.query.service;
        if (serviceName && typeof serviceName === 'string') {
            const service = this.appService.getService(serviceName);
            if (service) {
                req.service = service;
                return next();
            }
        }
        return res.send('Unknown service');
    }
}
