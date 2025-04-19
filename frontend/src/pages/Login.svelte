<script>
  import { onMount } from 'svelte';
  import { login, isAuthenticated } from '../utils/auth.js';
  import Icon from '@iconify/svelte';
  
  // وضعیت فرم
  let username = '';
  let password = '';
  let isLoading = false;
  let error = null;
  let redirectPath = '/';
  
  onMount(() => {
    // بررسی اگر کاربر قبلاً وارد شده است
    const urlParams = new URLSearchParams(window.location.search);
    redirectPath = urlParams.get('redirect') || '/';
    
    // اگر کاربر احراز هویت شده است، به صفحه اصلی هدایت شود
    // از unsubscribe استفاده می‌کنیم تا از حلقه بی‌پایان جلوگیری شود
    const unsubscribe = isAuthenticated.subscribe(value => {
      if (value) {
        // از history.replaceState استفاده می‌کنیم به جای تغییر مستقیم window.location.href
        // تا از رفرش مداوم صفحه جلوگیری شود
        history.replaceState(null, '', redirectPath);
        window.dispatchEvent(new Event('popstate'));
        // لغو اشتراک برای جلوگیری از فراخوانی مجدد
        unsubscribe();
      }
    });
    
    // لغو اشتراک هنگام unmount شدن کامپوننت
    return () => {
      unsubscribe();
    };
  });
  
  // تابع ارسال فرم
  async function handleSubmit() {
    if (!username || !password) {
      error = 'لطفاً نام کاربری و رمز عبور را وارد کنید';
      return;
    }
    
    try {
      isLoading = true;
      error = null;
      
      const result = await login(username, password);
      
      if (result.success) {
        // هدایت به صفحه اصلی یا صفحه قبلی
        window.location.href = redirectPath;
      } else {
        error = result.message;
      }
    } catch (err) {
      console.error('خطا در ورود به سیستم:', err);
      error = 'خطا در ارتباط با سرور';
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-100">
  <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
    <div class="text-center mb-8">
      <div class="flex justify-center mb-4">
        <Icon icon="mdi:medical-bag" class="text-5xl text-indigo-600" />
      </div>
      <h1 class="text-2xl font-bold text-gray-800">ورود به سامانه سوالات پزشکی</h1>
      <p class="text-gray-600 mt-2">لطفاً اطلاعات خود را وارد کنید</p>
    </div>
    
    <form on:submit|preventDefault={handleSubmit} class="space-y-6">
      {#if error}
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span class="block sm:inline">{error}</span>
        </div>
      {/if}
      
      <div>
        <label for="username" class="block text-sm font-medium text-gray-700 mb-1">نام کاربری</label>
        <input
          type="text"
          id="username"
          bind:value={username}
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="نام کاربری خود را وارد کنید"
          required
        />
      </div>
      
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">رمز عبور</label>
        <input
          type="password"
          id="password"
          bind:value={password}
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="رمز عبور خود را وارد کنید"
          required
        />
      </div>
      
      <div>
        <button
          type="submit"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={isLoading}
        >
          {#if isLoading}
            <Icon icon="mdi:loading" class="animate-spin ml-2" />
            در حال ورود...
          {:else}
            ورود به سیستم
          {/if}
        </button>
      </div>
    </form>
  </div>
</div>