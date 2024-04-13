import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class Bot {
    _id: string;

    @Prop({ required: true, index: true})
    accountName: string;
    @Prop({required: true})
    password: string;
    @Prop({ required: true })
    sharedSecret: string;
}

export type BotDocument = Bot & Document;
export const BotSchema = SchemaFactory.createForClass(Bot);