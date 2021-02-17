import {Controller, Get, Post, Render, Req, Res} from '@nestjs/common';
import {Request, Response} from 'express';

import {User} from 'entity';
import {ApplicationService, UserService} from 'service';
import {RegisteredMessage} from 'iframe';
import {BaseController} from './base';
import {ServiceRequest} from '../http';

@Controller()
export class RegisterController extends BaseController {
    constructor(readonly userService: UserService, readonly appService: ApplicationService) {
        super(userService, appService);
    }

    @Get('register')
    @Render('register-form')
    registerForm() {}

    @Post('register')
    register(@Req() request: Request & ServiceRequest, @Res() res: Response) {
        try {
            const user = this.createUser(request);
            this.userService.addUser(user);
            return this.returnIframeMessage(request.service, new RegisteredMessage(true), res);
        } catch (e) {
            return res.render('register-form', {error: e.message});
        }
    }

    /**
     * @todo use class-validator for validation
     * @param request
     * @protected
     */
    protected createUser(request: Request): User {
        const requestBody = request.body;
        for (const field of ['username', 'password', 'password2']) {
            if (!(field in requestBody)) {
                throw new Error(`Field ${field} is missing`);
            }
        }
        if (requestBody.password !== requestBody.password2) {
            throw new Error('Passwords do not match');
        }
        if (this.userService.hasUser(requestBody.username)) {
            throw new Error('User with this name already exists');
        }
        return new User(requestBody.username, requestBody.password);
    }
}
