import { Request as Req} from 'express';
import { AccessPayload } from './tokens.util';

export interface IRequest extends Req {
  userlang: string; 
}

export interface IAuthenticatedRequest extends IRequest {
  user?: AccessPayload;
}