export interface IUserDto {
  id: string; 
  username: string; 
  password?: string; 
  email: string | null; 
  isConfirmed: boolean;
}