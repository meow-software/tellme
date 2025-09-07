import { Injectable, Module } from '@nestjs/common';
import { JwtService as JWT } from '@nestjs/jwt';

@Injectable()
export class JwtService extends JWT{

}