import {Injectable} from '@nestjs/common';

import {User} from 'entity';

@Injectable()
export class JwtService {
    async getUserToken(user: User): Promise<string> {
        return 'auth-12345';
    }

    async getRefreshToken(user: User): Promise<string> {
        return 'refresh-12345';
    }

    async refreshAuthToken(refreshToken: string): Promise<string> {
        return 'auth-new-12345';
    }
}
