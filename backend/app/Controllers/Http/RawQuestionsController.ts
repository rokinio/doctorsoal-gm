// app/Controllers/Http/RawQuestionsController.ts
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import RawQuestion from "App/Models/RawQuestion";
import Env from "@ioc:Adonis/Core/Env";
import fetch from "node-fetch";

export default class RawQuestionsController {
  // دریافت لیست سوالات خام با پشتیبانی از صفحه‌بندی و فیلترها
  public async index({ request, response }: HttpContextContract) {
    try {
      const page = request.input("page", 1);
      const limit = request.input("limit", 10);

      // دریافت پارامترهای فیلتر
      const status = request.input("status");
      const categoryId = request.input("category_id");
      const search = request.input("search");

      const query = RawQuestion.query().preload("category"); // پیش‌بارگذاری اطلاعات دسته‌بندی

      // اعمال فیلترها
      if (status) {
        query.where("status", status);
      }

      if (categoryId) {
        query.where("category_id", categoryId);
      }

      if (search) {
        query.where("question", "ILIKE", `%${search}%`);
      }

      // اضافه کردن مرتب‌سازی بر اساس آیدی به صورت نزولی
      query.orderBy("id", "desc");

      const rawQuestions = await query.paginate(page, limit);

      return response.ok(rawQuestions);
    } catch (error) {
      return response.internalServerError({
        error: "خطا در دریافت سوالات خام",
        details: error.message,
      });
    }
  }
  // اضافه کردن متد جدید به کلاس RawQuestionsController
  public async sendToN8n({ params, response }: HttpContextContract) {
    try {
      // دریافت سوال بر اساس آیدی
      const rawQuestion = await RawQuestion.query()
        .where("id", params.id)
        .preload("category")
        .firstOrFail();

      // آدرس وبهوک n8n از متغیرهای محیطی
      const n8nWebhookUrl = Env.get(
        "N8N_WEBHOOK_URL",
        "https://n8n.hamyar.ai/webhook/your-webhook-path"
      );

      // ارسال درخواست به n8n
      const fetchResponse = await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rawQuestion),
      });

      if (!fetchResponse.ok) {
        throw new Error(`Error sending to n8n: ${fetchResponse.status}`);
      }

      // دریافت پاسخ از n8n
      const n8nResponse = await fetchResponse.json();

      // آپدیت وضعیت سوال به 'processing' یا هر وضعیت دیگری که نیاز دارید
      rawQuestion.status = "processing";
      await rawQuestion.save();

      return response.ok({
        success: true,
        message: "سوال با موفقیت به n8n ارسال شد",
        n8nResponse,
      });
    } catch (error) {
      console.error("Error sending to n8n:", error);

      if (error.code === "E_ROW_NOT_FOUND") {
        return response.notFound({ error: "سوال مورد نظر یافت نشد" });
      }

      return response.internalServerError({
        error: "خطا در ارسال سوال به n8n",
        details: error.message,
      });
    }
  }
  // دریافت اطلاعات آماری سوالات خام
  public async stats({ response }: HttpContextContract) {
    try {
      const totalCount = await RawQuestion.query().count("* as total");
      const minId = await RawQuestion.query().min("id as min_id");
      const maxId = await RawQuestion.query().max("id as max_id");

      return response.ok({
        total_records: totalCount[0].$extras.total,
        min_id: minId[0].$extras.min_id,
        max_id: maxId[0].$extras.max_id,
        message:
          "آیدی‌ها به صورت خودکار افزایشی هستند و در صورت حذف رکورد، شماره آن مجدداً استفاده نمی‌شود",
      });
    } catch (error) {
      return response.internalServerError({
        error: "خطا در دریافت آمار سوالات خام",
        details: error.message,
      });
    }
  }

  // دریافت جزئیات یک سوال خام
  public async show({ params, response }: HttpContextContract) {
    try {
      const rawQuestion = await RawQuestion.query()
        .where("id", params.id)
        .preload("category")
        .firstOrFail();

      return response.ok(rawQuestion);
    } catch (error) {
      return response.notFound({ error: "سوال مورد نظر یافت نشد" });
    }
  }

  // به‌روزرسانی یک سوال خام
  public async update({ params, request, response }: HttpContextContract) {
    try {
      const rawQuestion = await RawQuestion.findOrFail(params.id);

      // دریافت داده‌های ارسالی
      const data = request.only([
        "question",
        "conversation",
        "source",
        "category_id",
        "original_viewer_count",
        "status",
        "ai_response",
        "au",
      ]);

      // به‌روزرسانی داده‌ها
      rawQuestion.merge(data);
      await rawQuestion.save();

      // بارگذاری مجدد دسته‌بندی برای ارسال در پاسخ
      await rawQuestion.load("category");

      return response.ok(rawQuestion);
    } catch (error) {
      if (error.code === "E_ROW_NOT_FOUND") {
        return response.notFound({ error: "سوال مورد نظر یافت نشد" });
      }
      return response.internalServerError({
        error: "خطا در به‌روزرسانی سوال",
        details: error.message,
      });
    }
  }

  // حذف یک سوال خام
  public async destroy({ params, response }: HttpContextContract) {
    try {
      const rawQuestion = await RawQuestion.findOrFail(params.id);
      await rawQuestion.delete();

      return response.ok({ message: "سوال با موفقیت حذف شد" });
    } catch (error) {
      return response.notFound({ error: "سوال مورد نظر یافت نشد" });
    }
  }
}
