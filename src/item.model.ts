import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { GameItemSticker } from "csgo-inspect/dist/game-data";
import mongoose from "mongoose";

@Schema({ timestamps: true })
export class Item {
    _id: string;

    @Prop({ required: true, index: true})
    itemid: string;
    @Prop({required: true})
    defindex: number;
    @Prop({ required: true })
    paintindex: number;
    @Prop({ required: true, default: 0 })
    paintwear: number;
    @Prop({ default: null })
    paintseed: number;
    @Prop()
    killeatervalue: number | null;
    @Prop({ type: mongoose.Schema.Types.Mixed })
    killeaterscoretype: any;
    @Prop()
    customname: string | null;
    @Prop()
    stickers: GameItemSticker[];
    @Prop()
    rarity: number;
    @Prop()
    quality: number;
    @Prop()
    origin: number;
}

export type ItemDocument = Item & Document;
export const ItemSchema = SchemaFactory.createForClass(Item);
ItemSchema.index({
    defindex: 1,
    paintindex: 1,
    paintwear: 1,
    paintseed: 1
}, { unique: true });