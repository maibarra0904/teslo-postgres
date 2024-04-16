import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { RawHeaders } from './decorators/raw-header.decorator';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces';
import { Auth } from './decorators';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(
    @GetUser() user: User,
  ) {
    return this.authService.checkAuthStatus( user );
  }

  @Get('private')
  @UseGuards( AuthGuard() )
  testingPrivateRoute(
    @Req() request: Express.Request,
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @RawHeaders() rawHeaders: string[]
  ) {

    return {
      user,
      userEmail,
      rawHeaders
    };
  }

  //@SetMetadata('roles', ['admin', 'super-user'])

  //Una forma de aplicar autenticacion y autorización con decoradores unicos
  @Get('private2')
  @RoleProtected( ValidRoles.superUser, ValidRoles.admin)
  @UseGuards( AuthGuard(), UserRoleGuard )
  privateRoute2(
    
    @GetUser() user: User,

  ) {

    return {
      user,
    };
  }

  //Otra forma de aplicar autenticacion y autorización con composicion de decoradores
  @Get('private3')
  @Auth( ValidRoles.admin)
  privateRoute3(
    
    @GetUser() user: User,

  ) {

    return {
      user,
    };
  }

}
