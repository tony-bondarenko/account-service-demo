import {Injectable} from '@nestjs/common';
import {User} from 'entity';

const userMap = new Map<string, User>();

@Injectable()
export class UserService {
    hasUser(username: string): boolean {
        return userMap.has(username);
    }

    getUser(username: string): User | undefined {
        return userMap.get(username);
    }

    addUser(user: User) {
        if (this.hasUser(user.username)) {
            throw new Error('User exists');
        }
        userMap.set(user.username, user);
    }

    authUser(username: string, password: string): User | undefined {
        const user = this.getUser(username);
        if (!user) {
            // @todo auth is vulnerable to response time distribution attack. Add some hash compare to cause a delay.
            return undefined;
        }
        return user.checkPassword(password) ? user : undefined;
    }
}
