import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  hey(): string {
    return 'Hey!';
  }
  ping(): string {
    return 'Pong!';
  }
  health(): any {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      // memory: process.memoryUsage(),
      // cpu: process.cpuUsage(),
    };
  }
}
