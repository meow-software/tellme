import { Injectable } from '@nestjs/common';
import { IUserService, UserDTO } from '@tellme/common';
import { UserRepository } from '@tellme/database'; 

@Injectable()
export class UserService implements IUserService {
  constructor(private readonly userRepo: UserRepository) {}
    
  async findById(id: string): Promise<UserDTO | null> {
    return this.userRepo.findById(BigInt(id));  
  } 
}
