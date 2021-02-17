import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {AuthController, RegisterController} from './controller';
import {UserService, ApplicationService, JwtService} from './service';
import {ServiceMiddleware} from './middleware/service';

@Module({
    imports: [],
    controllers: [AuthController, RegisterController],
    providers: [UserService, ApplicationService, JwtService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(ServiceMiddleware).forRoutes('register', 'auth');
    }
}
