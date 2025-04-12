// app/Controllers/Http/CategoriesController.ts
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Category from "App/Models/Category";

export default class CategoriesController {
  // دریافت لیست همه دسته‌بندی‌ها
  public async index({ response }: HttpContextContract) {
    try {
      const categories = await Category.all();
      return response.ok(categories);
    } catch (error) {
      return response.internalServerError({
        error: "خطا در دریافت دسته‌بندی‌ها",
      });
    }
  }

  // دریافت جزئیات یک دسته‌بندی
  public async show({ params, response }: HttpContextContract) {
    try {
      const category = await Category.findOrFail(params.id);
      return response.ok(category);
    } catch (error) {
      return response.notFound({ error: "دسته‌بندی مورد نظر یافت نشد" });
    }
  }
}
