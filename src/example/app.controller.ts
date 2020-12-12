import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { AppInfo, APP_INFO } from './app.info';

const timeDistance = (date1: number, date2: number) => {
  let distance = Math.abs(date1 - date2);
  const hours = Math.floor(distance / 3600000);
  distance -= hours * 3600000;
  const minutes = Math.floor(distance / 60000);
  distance -= minutes * 60000;
  const seconds = Math.floor(distance / 1000);
  return `${hours}:${('0' + minutes).slice(-2)}:${('0' + seconds).slice(-2)}`;
};

@Controller()
export class AppController {
  constructor(@Inject(APP_INFO) private appInfo: AppInfo) {}

  @Get('/')
  getHello(): string {
    return 'Hello! This is an example NestJS rest application.';
  }

  @Get('/info')
  @ApiQuery({ name: 'type', required: false })
  getInfo(@Query('type') type: string = '') {
    const replacer = (_: any, value: any) => value ?? '';
    this.appInfo.upTime = timeDistance(Date.now(), this.appInfo.startTime);
    if (type === 'html') {
      return `<pre>${JSON.stringify(this.appInfo, replacer, 2)}</pre>`;
    } else {
      return this.appInfo;
    }
  }
}
