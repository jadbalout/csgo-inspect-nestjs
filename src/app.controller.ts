import { Body, Controller, Get, InternalServerErrorException, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async get(@Query() query) {
    if('url' in query) {
      return this.appService.inspectURL(query.url);
    }
    throw new InternalServerErrorException("Invalid query parameters");
  }
  @Post()
  async post(@Body() body) {
    if('urls' in body) {
      return this.appService.inspectURLs(body.urls);
    }
    throw new InternalServerErrorException("Invalid body parameters");
  }
}
