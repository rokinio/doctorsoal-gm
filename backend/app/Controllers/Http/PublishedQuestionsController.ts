// backend/app/Controllers/Http/PublishedQuestionsController.ts
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import PublishedQuestion from "App/Models/PublishedQuestion";
import RawQuestion from "App/Models/RawQuestion";
import { DateTime } from "luxon";

export default class PublishedQuestionsController {
  // دریافت لیست سوالات منتشر شده
  public async index({ request, response }: HttpContextContract) {
    try {
      const page = request.input("page", 1);
      const limit = request.input("limit", 10);
      const categoryId = request.input("category_id");

      const query = PublishedQuestion.query()
        .preload("category")
        .orderBy("publish_date", "desc");

      if (categoryId) {
        query.where("category_id", categoryId);
      }

      const publishedQuestions = await query.paginate(page, limit);

      return response.ok(publishedQuestions);
    } catch (error) {
      console.error("Error in PublishedQuestionsController.index:", error);
      return response.internalServerError({
        message: "خطا در بازیابی لیست سوالات منتشر شده",
        error: error.message,
      });
    }
  }

  // دریافت جزئیات یک سوال منتشر شده
  public async show({ params, response }: HttpContextContract) {
    try {
      // می‌توان با id یا slug جستجو کرد
      const query = PublishedQuestion.query().preload("category");

      if (Number.isInteger(Number(params.id))) {
        query.where("id", params.id);
      } else {
        query.where("slug", params.id);
      }

      const publishedQuestion = await query.firstOrFail();

      // افزایش شمارنده بازدید
      publishedQuestion.currentViewCount += 1;
      await publishedQuestion.save();

      return response.ok(publishedQuestion);
    } catch (error) {
      console.error("Error in PublishedQuestionsController.show:", error);
      return response.notFound({
        message: "سوال مورد نظر یافت نشد",
        error: error.message,
      });
    }
  }

  // انتشار سوال خام
  public async publish({ params, request, response }: HttpContextContract) {
    try {
      // بررسی وجود سوال خام
      const rawQuestion = await RawQuestion.findOrFail(params.id);

      // بررسی وضعیت سوال
      if (rawQuestion.status === "published") {
        return response.badRequest({
          message: "این سوال قبلاً منتشر شده است",
        });
      }

      // دریافت داده‌های ارسالی
      const data = request.only([
        "title",
        "optimizedQuestionText",
        "optimizedAnswerText",
        "doctorSpecialty",
        "categoryId",
        "schemaMarkup",
      ]);

      // ایجاد slug از عنوان
      const slug = this.createSlug(data.title || rawQuestion.question);

      // ایجاد سوال منتشر شده
      const publishedQuestion = await PublishedQuestion.create({
        rawQuestionId: rawQuestion.id,
        title: data.title || rawQuestion.question,
        slug,
        optimizedQuestionText:
          data.optimizedQuestionText || rawQuestion.question,
        optimizedAnswerText: data.optimizedAnswerText || "",
        categoryId: data.categoryId || rawQuestion.categoryId,
        doctorSpecialty: data.doctorSpecialty || null,
        originalViewerCount: rawQuestion.originalViewerCount || 0,
        currentViewCount: 0,
        schemaMarkup:
          data.schemaMarkup ||
          this.generateSchemaMarkup(
            data.title || rawQuestion.question,
            data.optimizedQuestionText || rawQuestion.question,
            data.optimizedAnswerText || ""
          ),
        publishDate: DateTime.now(),
        status: "published",
      });

      // به‌روزرسانی وضعیت سوال خام
      rawQuestion.status = "published";
      await rawQuestion.save();

      return response.created(publishedQuestion);
    } catch (error) {
      console.error("Error in PublishedQuestionsController.publish:", error);
      return response.badRequest({
        message: "خطا در انتشار سوال",
        error: error.message,
      });
    }
  }

  // به‌روزرسانی سوال منتشر شده
  public async update({ params, request, response }: HttpContextContract) {
    try {
      const publishedQuestion = await PublishedQuestion.findOrFail(params.id);

      // دریافت داده‌های ارسالی
      const data = request.only([
        "title",
        "optimizedQuestionText",
        "optimizedAnswerText",
        "doctorSpecialty",
        "categoryId",
        "schemaMarkup",
      ]);

      // به‌روزرسانی slug اگر عنوان تغییر کرده باشد
      if (data.title && data.title !== publishedQuestion.title) {
        data.slug = this.createSlug(data.title);
      }

      // به‌روزرسانی سوال
      publishedQuestion.merge(data);
      await publishedQuestion.save();

      return response.ok(publishedQuestion);
    } catch (error) {
      console.error("Error in PublishedQuestionsController.update:", error);
      return response.badRequest({
        message: "خطا در به‌روزرسانی سوال",
        error: error.message,
      });
    }
  }

  // حذف انتشار سوال
  public async destroy({ params, response }: HttpContextContract) {
    try {
      const publishedQuestion = await PublishedQuestion.findOrFail(params.id);

      // پیدا کردن سوال خام مرتبط
      const rawQuestion = await RawQuestion.find(
        publishedQuestion.rawQuestionId
      );
      if (rawQuestion) {
        // تغییر وضعیت سوال خام به «پردازش شده»
        rawQuestion.status = "processed";
        await rawQuestion.save();
      }

      // حذف سوال منتشر شده
      await publishedQuestion.delete();

      return response.ok({
        message: "سوال با موفقیت از انتشار خارج شد",
      });
    } catch (error) {
      console.error("Error in PublishedQuestionsController.destroy:", error);
      return response.badRequest({
        message: "خطا در حذف انتشار سوال",
        error: error.message,
      });
    }
  }

  // ایجاد slug از متن
  private createSlug(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // فاصله‌ها را به خط تیره تبدیل می‌کند
      .replace(
        /[^\u0600-\u06FF\uFB8A\u067E\u0686\u06AF\u200C\u200Fa-z0-9-]/g,
        ""
      ) // فقط حروف فارسی، انگلیسی و اعداد را نگه می‌دارد
      .replace(/-+/g, "-"); // چندین خط تیره پشت سر هم را به یک خط تیره تبدیل می‌کند
  }

  // تولید اسکیمای QAPage برای SEO
  private generateSchemaMarkup(
    title: string,
    question: string,
    answer: string
  ) {
    return {
      "@context": "https://schema.org",
      "@type": "QAPage",
      mainEntity: {
        "@type": "Question",
        name: title,
        text: question,
        answerCount: 1,
        datePublished: DateTime.now().toISO(),
        acceptedAnswer: {
          "@type": "Answer",
          text: answer,
          datePublished: DateTime.now().toISO(),
        },
      },
    };
  }
}
