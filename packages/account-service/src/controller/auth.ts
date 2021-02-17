import {Controller, Get, Post, Render, Req, Res} from '@nestjs/common';
import {Request, Response} from 'express';

import {ApplicationService, JwtService, UserService} from 'service';
import {User} from 'entity';
import {AuthorizedMessage} from 'iframe';
import {BaseController} from './base';
import {ServiceRequest} from '../http';

@Controller('auth')
export class AuthController extends BaseController {
    protected static readonly RT_COOKIE_NAME = 'rt';

    constructor(
        protected readonly jwtService: JwtService,
        readonly userService: UserService,
        readonly appService: ApplicationService
    ) {
        super(userService, appService);
    }

    @Get('sso')
    async sso(@Req() request: Request & ServiceRequest, @Res() res: Response) {
        if (request.cookies && AuthController.RT_COOKIE_NAME in request.cookies) {
            const authToken = await this.jwtService.refreshAuthToken(
                request.cookies[AuthController.RT_COOKIE_NAME]
            );
            return this.returnIframeMessage(request.service, new AuthorizedMessage(authToken), res);
        }
        return this.returnIframeMessage(request.service, new AuthorizedMessage(null), res);
    }

    @Get('login')
    @Render('login-form')
    loginForm(@Req() request: Request, @Res() res: Response) {}

    @Post('login')
    async login(@Req() request: Request & ServiceRequest, @Res() res: Response) {
        try {
            const user = this.authUser(request);
            if (!user) {
                return res.render('login-form', {error: 'Incorrect credentials'});
            }

            const authToken = await this.jwtService.getUserToken(user);
            const refreshToken = await this.jwtService.getRefreshToken(user);

            res.cookie(AuthController.RT_COOKIE_NAME, refreshToken, {
                httpOnly: true,
                secure: true,
                path: '/auth/sso',
                sameSite: 'none',
            });
            return this.returnIframeMessage(request.service, new AuthorizedMessage(authToken), res);
        } catch (e) {
            return res.render('login-form', {error: e.message});
        }
    }

    @Get('logout')
    logout() {
        return 'logout';
    }

    protected authUser(request: Request): User | undefined {
        const requestBody = request.body;
        for (const field of ['username', 'password']) {
            if (!(field in requestBody)) {
                throw new Error(`Field ${field} is missing`);
            }
        }
        return this.userService.authUser(requestBody.username, requestBody.password);
    }
}
