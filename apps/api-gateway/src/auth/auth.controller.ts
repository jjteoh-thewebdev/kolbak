import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AuthRequestDto } from './dto/auth.request.dto';
import { AuthService, IAuthService } from './auth.service';
import { AUTH_SERVICE_TOKEN } from './auth.constants';

// /api/v1/auth
@Controller({
    path: 'auth',
    version: '1'
})
export class AuthController {
    constructor(
        @Inject(AUTH_SERVICE_TOKEN) private readonly authService: IAuthService) { }

    @Post()
    async authenticate(@Body() authRequest: AuthRequestDto) {
        return this.authService.authenticate(authRequest);
    }
} 