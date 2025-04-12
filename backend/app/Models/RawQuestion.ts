import { DateTime } from "luxon";
import { BaseModel, column, belongsTo, BelongsTo } from "@ioc:Adonis/Lucid/Orm";
import Category from "./Category";

export default class RawQuestion extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public question: string;

  @column()
  public conversation: any;

  @column()
  public source: string | null;

  @column()
  public au: string | null;

  @column()
  public categoryId: number | null;

  @column()
  public originalViewerCount: number;

  @column()
  public status: string;

  @column()
  public aiResponse: any | null;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @belongsTo(() => Category)
  public category: BelongsTo<typeof Category>;
}
