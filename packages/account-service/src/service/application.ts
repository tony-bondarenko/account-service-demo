import {Injectable} from '@nestjs/common';
import {Service} from '../entity';

@Injectable()
export class ApplicationService {
    protected serviceMap = new Map<string, Service>();

    constructor() {
        for (const serviceName of ['app1.com', 'app2.com']) {
            this.serviceMap.set(serviceName, new Service(serviceName));
        }
    }

    hasService(serviceDomain: string): boolean {
        return this.serviceMap.has(serviceDomain);
    }

    getService(serviceDomain: string): Service | undefined {
        return this.serviceMap.get(serviceDomain);
    }
}
