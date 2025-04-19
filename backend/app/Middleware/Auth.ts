import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Hash from "@ioc:Adonis/Core/Hash";

// اطلاعات کاربر ادمین
const ADMIN_USER = {
  username: "adminsoal",
  password: "@mir741@mir",
};

export default class Auth {
  public async handle(
    { request, response }: HttpContextContract,
    next: () => Promise<void>
  ) {
    // بررسی هدرهای احراز هویت
    const authHeader = request.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Basic ")) {
      return response.status(401).json({
        message: "احراز هویت ناموفق: هدر Authorization یافت نشد یا نامعتبر است",
      });
    }

    // استخراج نام کاربری و رمز عبور از هدر
    try {
      const base64Credentials = authHeader.split(" ")[1];
      const credentials = Buffer.from(base64Credentials, "base64").toString(
        "utf-8"
      );
      const [username, password] = credentials.split(":");

      // بررسی اعتبار نام کاربری و رمز عبور
      if (
        username === ADMIN_USER.username &&
        password === ADMIN_USER.password
      ) {
        // کاربر احراز هویت شده است
        await next();
      } else {
        return response.status(401).json({
          message: "احراز هویت ناموفق: نام کاربری یا رمز عبور نادرست است",
        });
      }
    } catch (error) {
      return response.status(401).json({
        message: "احراز هویت ناموفق: خطا در پردازش اطلاعات احراز هویت",
      });
    }
  }
}
