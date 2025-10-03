import { Request as Req} from 'express';
import { AccessPayload } from './tokens.util';

export interface IRequest extends Req {
  userLang: string;
}

export interface IAuthenticatedRequest extends IRequest {
  user?: AccessPayload;
}