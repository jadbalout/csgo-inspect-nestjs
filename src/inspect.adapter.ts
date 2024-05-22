import { Injectable } from "@nestjs/common";
import { FileAdapter } from "csgo-inspect/dist/adapter";
import { Item, ItemDocument } from "./models/item.model";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CSGOItem } from "csgo-inspect/dist/bot";
import { Bot, BotDocument } from "./models/bot.model";

@Injectable()
export class InspectAdapter extends FileAdapter {
    constructor(
        @InjectModel(Item.name) private readonly itemModel: Model<ItemDocument>,
        @InjectModel(Bot.name) private readonly botModel: Model<BotDocument>,
    ) {
        super();
    }

    async getBots(): Promise<any> {
        return this.botModel.find().lean();
    }

    async getItemByAssetId(assetId: string): Promise<any> {
        return this.itemModel.findOne({ itemid: assetId }).lean();
    }
    async getItemsByAssetIds(assetIds: string[]): Promise<any> {
        return this.itemModel.find({ itemid: { $in: assetIds } }).lean();
    }

    async createOrUpdateItem(item: CSGOItem) {
        //Check if item by assetid exists or item by defindex, paintindex, paintwear, paintseed exists
        //If item by assetid exists, update it
        //If item by defindex, paintindex, paintwear, paintseed exists, update it
        //If item doesn't exist, create it
        const { itemid, defindex, paintindex, paintwear, paintseed } = item;
        const fakeseed = paintseed ? paintseed : Math.random(); //fakeseed for items without paintseed to offset unique index
        const existingItem = await this.itemModel.findOne({
            $or: [
                { itemid },
                { defindex, paintindex, paintwear, paintseed, fakeseed }
            ]
        });
        if(existingItem) {
            existingItem.stickers = item.stickers;
            existingItem.itemid = item.itemid;
            existingItem.save();
        } else {
            const newItem = new this.itemModel({
                itemid,
                defindex,
                paintindex,
                paintwear,
                paintseed,
                fakeseed,
                killeatervalue: item.killeatervalue,
                killeaterscoretype: item.killeaterscoretype,
                customname: item.customname,
                stickers: item.stickers,
                rarity: item.rarity,
                quality: item.quality,
                origin: item.origin
            });
            newItem.save();
        }
    }

    async createOrUpdateItems(items: CSGOItem[]) {
        const itemsToCreate = [];
        const itemsToUpdate = [];
        for(const item of items) {
            const { itemid, defindex, paintindex, paintwear, paintseed } = item;
            const fakeseed = paintseed ? paintseed : Math.random(); //fakeseed for items without paintseed to offset unique index
            const existingItem = await this.itemModel.findOne({
                $or: [
                    { itemid },
                    { defindex, paintindex, paintwear, paintseed, fakeseed }
                ]
            });
            if(existingItem) {
                existingItem.stickers = item.stickers;
                existingItem.itemid = item.itemid;
                itemsToUpdate.push(existingItem);
            } else {
                itemsToCreate.push({
                    itemid,
                    defindex,
                    paintindex,
                    paintwear,
                    paintseed,
                    fakeseed,
                    killeatervalue: item.killeatervalue,
                    killeaterscoretype: item.killeaterscoretype,
                    customname: item.customname,
                    stickers: item.stickers,
                    rarity: item.rarity,
                    quality: item.quality,
                    origin: item.origin
                });
            }
        }
        await this.itemModel.insertMany(itemsToCreate);
        await this.itemModel.bulkWrite(itemsToUpdate.map(item => ({
            updateOne: {
                filter: { _id: item._id },
                update: item.toObject()
            }
        })));
    }
    
}