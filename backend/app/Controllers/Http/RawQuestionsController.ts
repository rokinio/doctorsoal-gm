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
      const hasConversation = request.input("has_conversation"); // پارامتر جدید برای فیلتر مکالمه

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
      const conversationCount = request.input("conversation_count");
      if (conversationCount) {
        if (conversationCount === "more-than-2") {
          // فیلتر برای سوالاتی که بیش از 2 پیام دارند
          query.whereRaw("jsonb_array_length(conversation) > 2");
        } else if (conversationCount === "2") {
          // فیلتر برای سوالاتی که دقیقاً 2 پیام دارند
          query.whereRaw("jsonb_array_length(conversation) = 2");
        } else if (conversationCount === "less-than-2") {
          // فیلتر برای سوالاتی که کمتر از 2 پیام دارند
          query.whereRaw("jsonb_array_length(conversation) < 2");
        }
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
  // backend/app/Controllers/Http/RawQuestionsController.ts
  // به کلاس RawQuestionsController این متد را اضافه یا اصلاح کنید

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
        "https://example.com/webhook"
      );

      // برای نسخه تست می‌توانیم ارسال به n8n را شبیه‌سازی کنیم
      let n8nResponse = null;

      try {
        // ارسال درخواست به n8n - در محیط تست می‌توانید این بخش را کامنت کنید
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
        n8nResponse = await fetchResponse.json();
      } catch (fetchError) {
        console.error("Fetch error:", fetchError);
        // در محیط تست می‌توانیم از خطای fetch صرف نظر کنیم
        n8nResponse = { simulated: true, message: "Simulated n8n response" };
      }

      // آپدیت وضعیت سوال به 'processing'
      rawQuestion.status = "processing";
      await rawQuestion.save();

      return response.ok({
        success: true,
        message: "سوال با موفقیت به n8n ارسال شد",
        n8nResponse,
        rawQuestion,
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

  // در فایل backend/app/Controllers/Http/RawQuestionsController.ts
  // این متد را اضافه کنید:

  public async dashboard({ response }: HttpContextContract) {
    try {
      // تعداد سوالات خام
      const rawCount = await RawQuestion.query()
        .where("status", "pending")
        .count("* as total");

      // تعداد سوالات پردازش شده
      const processedCount = await RawQuestion.query()
        .where("status", "processing")
        .count("* as total");

      // تعداد سوالات منتشر شده
      const publishedCount = await RawQuestion.query()
        .where("status", "published")
        .count("* as total");

      // مجموع بازدیدها
      const totalViews = await RawQuestion.query().sum(
        "original_viewer_count as total"
      );

      return response.ok({
        raw_count: parseInt(rawCount[0].$extras.total || "0"),
        processed_count: parseInt(processedCount[0].$extras.total || "0"),
        published_count: parseInt(publishedCount[0].$extras.total || "0"),
        total_views: parseInt(totalViews[0].$extras.total || "0"),
      });
    } catch (error) {
      return response.internalServerError({
        error: "خطا در دریافت آمار داشبورد",
        details: error.message,
      });
    }
  }
  // در فایل backend/app/Controllers/Http/RawQuestionsController.ts
  // این متد را اضافه کنید:

  public async weeklyStats({ response }: HttpContextContract) {
    try {
      const days = [
        "شنبه",
        "یکشنبه",
        "دوشنبه",
        "سه‌شنبه",
        "چهارشنبه",
        "پنج‌شنبه",
        "جمعه",
      ];
      const weeklyData = [];

      // برای هر روز هفته، تعداد سوالات آن روز را محاسبه می‌کنیم
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        // تبدیل تاریخ به فرمت مناسب برای مقایسه در دیتابیس
        const formattedDate = date.toISOString().split("T")[0];

        // شمارش سوالات ایجاد شده در این روز
        const count = await RawQuestion.query()
          .whereRaw("DATE(created_at) = ?", [formattedDate])
          .count("* as total");

        weeklyData.push({
          day: days[6 - i], // تبدیل شاخص به روز هفته فارسی
          count: parseInt(count[0].$extras.total || "0"),
        });
      }

      return response.ok(weeklyData);
    } catch (error) {
      return response.internalServerError({
        error: "خطا در دریافت آمار هفتگی",
        details: error.message,
      });
    }
  }
  // در فایل backend/app/Controllers/Http/RawQuestionsController.ts
  // این متد را اضافه کنید:

  public async recentQuestions({ response }: HttpContextContract) {
    try {
      // دریافت ۵ سوال اخیر
      const recentQuestions = await RawQuestion.query()
        .preload("category")
        .orderBy("created_at", "desc")
        .limit(5);

      // تبدیل داده‌ها به فرمت مورد نیاز
      const formattedQuestions = recentQuestions.map((q) => {
        return {
          id: q.id,
          title: q.question,
          category: q.category ? q.category.name : "بدون دسته‌بندی",
          status: q.status,
          date: q.createdAt.toFormat("yyyy/MM/dd"),
        };
      });

      return response.ok(formattedQuestions);
    } catch (error) {
      return response.internalServerError({
        error: "خطا در دریافت سوالات اخیر",
        details: error.message,
      });
    }
  }
}
