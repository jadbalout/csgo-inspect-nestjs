import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigType } from '@nestjs/config';
import dbConfig from './config/db.config';
import { MongooseModule } from '@nestjs/mongoose';
import { InspectAdapter } from './inspect.adapter';
import { Item, ItemSchema } from './item.model';
import proxiesConfig from './config/proxies.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [
        dbConfig,
        proxiesConfig
      ]
    }),
    MongooseModule.forRootAsync({
      useFactory: ({ uri }: ConfigType<typeof dbConfig>) =>
        ({ uri }),
      inject: [dbConfig.KEY]
    }),
    MongooseModule.forFeature([
      { name: Item.name, schema: ItemSchema }
    ])
  ],
  controllers: [AppController],
  providers: [
    InspectAdapter,
    AppService
  ],
})
export class AppModule { }
