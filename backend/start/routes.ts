// start/routes.ts
import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  // دریافت لیست سوالات منتشر شده
  Route.get("/published-questions", "PublishedQuestionsController.index");

  // دریافت جزئیات یک سوال منتشر شده (با id یا slug)
  Route.get("/published-questions/:id", "PublishedQuestionsController.show");

  // انتشار یک سوال
  Route.post(
    "/raw-questions/:id/publish",
    "PublishedQuestionsController.publish"
  );

  // به‌روزرسانی یک سوال منتشر شده
  Route.put("/published-questions/:id", "PublishedQuestionsController.update");

  // حذف انتشار یک سوال
  Route.delete(
    "/published-questions/:id",
    "PublishedQuestionsController.destroy"
  );
  // مسیرهای مربوط به دسته‌بندی‌ها
  Route.get("/categories", "CategoriesController.index");
  Route.get("/categories/:id", "CategoriesController.show");
  Route.post(
    "/raw-questions/:id/send-to-n8n",
    "RawQuestionsController.sendToN8n"
  );
  Route.get("/dashboard-stats", "RawQuestionsController.dashboard");
  Route.get("/weekly-stats", "RawQuestionsController.weeklyStats");
  Route.get("/recent-questions", "RawQuestionsController.recentQuestions");

  // مسیرهای مربوط به سوالات خام
  Route.get("/raw-questions", "RawQuestionsController.index");
  Route.get("/raw-questions/:id", "RawQuestionsController.show");
  Route.put("/raw-questions/:id", "RawQuestionsController.update"); // این خط را اضافه کنید
  Route.delete("/raw-questions/:id", "RawQuestionsController.destroy");
  Route.get("/api/raw-questions/stats", "RawQuestionsController.stats");
}).prefix("api");
