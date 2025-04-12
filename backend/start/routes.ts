// start/routes.ts
import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  // مسیرهای مربوط به دسته‌بندی‌ها
  Route.get("/categories", "CategoriesController.index");
  Route.get("/categories/:id", "CategoriesController.show");

  // مسیرهای مربوط به سوالات خام
  Route.get("/raw-questions", "RawQuestionsController.index");
  Route.get("/raw-questions/:id", "RawQuestionsController.show");
  Route.put("/raw-questions/:id", "RawQuestionsController.update"); // این خط را اضافه کنید
  Route.delete("/raw-questions/:id", "RawQuestionsController.destroy");
  Route.get("/api/raw-questions/stats", "RawQuestionsController.stats");
}).prefix("api");
