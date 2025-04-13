// app/Models/PublishedQuestion.ts
import { DateTime } from "luxon";
import { BaseModel, column, belongsTo, BelongsTo } from "@ioc:Adonis/Lucid/Orm";
import Category from "./Category";
import RawQuestion from "./RawQuestion";

export default class PublishedQuestion extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public rawQuestionId: number;

  @column()
  public title: string;

  @column()
  public slug: string;

  @column()
  public optimizedQuestionText: string;

  @column()
  public optimizedAnswerText: string;

  @column()
  public categoryId: number | null;

  @column()
  public doctorSpecialty: string | null;

  @column()
  public originalViewerCount: number;

  @column()
  public currentViewCount: number;

  @column()
  public schemaMarkup: any;

  @column.dateTime()
  public publishDate: DateTime;

  @column()
  public status: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @belongsTo(() => Category)
  public category: BelongsTo<typeof Category>;

  @belongsTo(() => RawQuestion)
  public rawQuestion: BelongsTo<typeof RawQuestion>;
}
