import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import fs from "fs";
import path from "path";

// مسیر فایل ذخیره رمز عبور
const PASSWORD_FILE_PATH = path.join(__dirname, "../../../../password.json");

// اطلاعات پیش‌فرض کاربر ادمین
const DEFAULT_ADMIN = {
  username: "adminsoal",
  password: "@mir741@mir",
};

export default class AuthController {
  /**
   * متد برای بررسی اعتبار کاربر و ورود به سیستم
   */
  public async login({ request, response }: HttpContextContract) {
    const { username, password } = request.only(["username", "password"]);

    // خواندن اطلاعات کاربر از فایل
    let adminUser = DEFAULT_ADMIN;

    try {
      if (fs.existsSync(PASSWORD_FILE_PATH)) {
        const fileContent = fs.readFileSync(PASSWORD_FILE_PATH, "utf8");
        adminUser = JSON.parse(fileContent);
      } else {
        // ایجاد فایل با اطلاعات پیش‌فرض اگر وجود نداشته باشد
        fs.writeFileSync(
          PASSWORD_FILE_PATH,
          JSON.stringify(DEFAULT_ADMIN, null, 2)
        );
      }
    } catch (error) {
      console.error("خطا در خواندن فایل رمز عبور:", error);
    }

    // بررسی اعتبار نام کاربری و رمز عبور
    if (username === adminUser.username && password === adminUser.password) {
      return response.json({
        success: true,
        message: "ورود موفقیت‌آمیز",
      });
    }

    return response.status(401).json({
      success: false,
      message: "نام کاربری یا رمز عبور نادرست است",
    });
  }

  /**
   * متد برای تغییر رمز عبور ادمین
   */
  public async changePassword({ request, response }: HttpContextContract) {
    const { currentPassword, newPassword } = request.only([
      "currentPassword",
      "newPassword",
    ]);

    // خواندن اطلاعات کاربر از فایل
    let adminUser = DEFAULT_ADMIN;

    try {
      if (fs.existsSync(PASSWORD_FILE_PATH)) {
        const fileContent = fs.readFileSync(PASSWORD_FILE_PATH, "utf8");
        adminUser = JSON.parse(fileContent);
      }

      // بررسی رمز عبور فعلی
      if (currentPassword !== adminUser.password) {
        return response.status(401).json({
          success: false,
          message: "رمز عبور فعلی نادرست است",
        });
      }

      // به‌روزرسانی رمز عبور
      adminUser.password = newPassword;

      // ذخیره اطلاعات جدید در فایل
      fs.writeFileSync(PASSWORD_FILE_PATH, JSON.stringify(adminUser, null, 2));

      return response.json({
        success: true,
        message: "رمز عبور با موفقیت تغییر یافت",
      });
    } catch (error) {
      console.error("خطا در تغییر رمز عبور:", error);
      return response.status(500).json({
        success: false,
        message: "خطا در تغییر رمز عبور",
      });
    }
  }
}
