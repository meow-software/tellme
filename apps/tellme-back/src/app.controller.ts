import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import {type Request } from 'express';
import { type IAuthenticatedRequest } from '@tellme/common';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get("/")
  hey(): string {
    return this.appService.hey();
  }
  @Get("/ping")
  ping(): string {
    return this.appService.ping();
  }

  @Get("/health")
  health(): any {
    return this.appService.health();
  }

  @Get("/lang")
  getLang(@Req() req: IAuthenticatedRequest) {
    return {
      message: `Langue détectée: ${req.userLang}`,
    };
  }
}
