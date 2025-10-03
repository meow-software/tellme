import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from 'src/lib/common';

@Controller('users')
export class UserController {
  constructor(private readonly userService : UserService) {}

  @Get("/")
  async hey(): Promise<UserDTO | null> {
    return await this.userService.findById("48548545");
  }
}
