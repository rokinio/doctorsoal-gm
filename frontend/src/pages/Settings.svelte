<script>
    import Icon from '@iconify/svelte';
    import { onMount } from 'svelte';
    
    // داده‌های فرم تنظیمات
    let settings = {
      general: {
        siteName: 'سامانه سوالات پزشکی',
        adminEmail: 'admin@example.com',
        notificationEmail: 'notify@example.com',
        itemsPerPage: 10,
        defaultLanguage: 'fa'
      },
      api: {
        n8nUrl: 'https://n8n.example.com/webhook',
        n8nToken: 'your-n8n-token',
        enableLogging: true,
        requestTimeout: 30
      },
      notification: {
        enableEmailNotifications: true,
        enablePushNotifications: false,
        notifyOnNewQuestion: true,
        notifyOnProcessedQuestion: true,
        notifyOnPublishedQuestion: true
      }
    };
    
    // وضعیت تب‌ها
    let activeTab = 'general';
    
    // ذخیره تنظیمات
    function saveSettings() {
      // اینجا اطلاعات به سرور ارسال می‌شود
      alert('تنظیمات با موفقیت ذخیره شد.');
    }
    
    // تغییر تب فعال
    function setActiveTab(tab) {
      activeTab = tab;
    }
    
    onMount(() => {
      // دریافت تنظیمات از سرور
    });
  </script>
  
  <div class="container mx-auto">
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <div class="flex border-b border-gray-200">
        <button 
          class={`px-6 py-4 text-sm font-medium ${activeTab === 'general' ? 'text-indigo-600 border-b-2 border-indigo-500' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          on:click={() => setActiveTab('general')}
        >
          <div class="flex items-center">
            <Icon icon="mdi:cog" class="ml-2" />
            تنظیمات عمومی
          </div>
        </button>
        <button 
          class={`px-6 py-4 text-sm font-medium ${activeTab === 'api' ? 'text-indigo-600 border-b-2 border-indigo-500' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          on:click={() => setActiveTab('api')}
        >
          <div class="flex items-center">
            <Icon icon="mdi:api" class="ml-2" />
            تنظیمات API
          </div>
        </button>
        <button 
          class={`px-6 py-4 text-sm font-medium ${activeTab === 'notification' ? 'text-indigo-600 border-b-2 border-indigo-500' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          on:click={() => setActiveTab('notification')}
        >
          <div class="flex items-center">
            <Icon icon="mdi:bell" class="ml-2" />
            تنظیمات اعلان‌ها
          </div>
        </button>
      </div>
  
      <div class="p-6">
        <!-- تنظیمات عمومی -->
        {#if activeTab === 'general'}
          <div>
            <h2 class="text-lg font-semibold mb-4">تنظیمات عمومی</h2>
            <div class="space-y-4">
              <div>
                <label for="siteName" class="block text-sm font-medium text-gray-700">نام سایت</label>
                <input
                  type="text"
                  id="siteName"
                  bind:value={settings.general.siteName}
                  class="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              
              <div>
                <label for="adminEmail" class="block text-sm font-medium text-gray-700">ایمیل مدیر</label>
                <input
                  type="email"
                  id="adminEmail"
                  bind:value={settings.general.adminEmail}
                  class="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              
              <div>
                <label for="notificationEmail" class="block text-sm font-medium text-gray-700">ایمیل دریافت اعلان‌ها</label>
                <input
                  type="email"
                  id="notificationEmail"
                  bind:value={settings.general.notificationEmail}
                  class="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              
              <div>
                <label for="itemsPerPage" class="block text-sm font-medium text-gray-700">تعداد آیتم در هر صفحه</label>
                <input
                  type="number"
                  id="itemsPerPage"
                  bind:value={settings.general.itemsPerPage}
                  min="5"
                  max="100"
                  class="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              
              <div>
                <label for="defaultLanguage" class="block text-sm font-medium text-gray-700">زبان پیش‌فرض</label>
                <select
                  id="defaultLanguage"
                  bind:value={settings.general.defaultLanguage}
                  class="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                  <option value="fa">فارسی</option>
                  <option value="en">انگلیسی</option>
                  <option value="ar">عربی</option>
                </select>
              </div>
            </div>
          </div>
        {/if}
  
        <!-- تنظیمات API -->
        {#if activeTab === 'api'}
          <div>
            <h2 class="text-lg font-semibold mb-4">تنظیمات API</h2>
            <div class="space-y-4">
              <div>
                <label for="n8nUrl" class="block text-sm font-medium text-gray-700">آدرس وب‌هوک n8n</label>
                <input
                  type="text"
                  id="n8nUrl"
                  bind:value={settings.api.n8nUrl}
                  class="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              
              <div>
                <label for="n8nToken" class="block text-sm font-medium text-gray-700">توکن دسترسی n8n</label>
                <input
                  type="password"
                  id="n8nToken"
                  bind:value={settings.api.n8nToken}
                  class="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              
              <div class="flex items-center">
                <input
                  type="checkbox"
                  id="enableLogging"
                  bind:checked={settings.api.enableLogging}
                  class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <label for="enableLogging" class="mr-2 block text-sm text-gray-700">فعال‌سازی ثبت لاگ</label>
              </div>
              
              <div>
                <label for="requestTimeout" class="block text-sm font-medium text-gray-700">زمان انتظار درخواست (ثانیه)</label>
                <input
                  type="number"
                  id="requestTimeout"
                  bind:value={settings.api.requestTimeout}
                  min="5"
                  max="120"
                  class="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
            </div>
          </div>
        {/if}
  
        <!-- تنظیمات اعلان‌ها -->
        {#if activeTab === 'notification'}
          <div>
            <h2 class="text-lg font-semibold mb-4">تنظیمات اعلان‌ها</h2>
            <div class="space-y-4">
              <div class="flex items-center">
                <input
                  type="checkbox"
                  id="enableEmailNotifications"
                  bind:checked={settings.notification.enableEmailNotifications}
                  class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <label for="enableEmailNotifications" class="mr-2 block text-sm text-gray-700">فعال‌سازی اعلان‌های ایمیلی</label>
              </div>
              
              <div class="flex items-center">
                <input
                  type="checkbox"
                  id="enablePushNotifications"
                  bind:checked={settings.notification.enablePushNotifications}
                  class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <label for="enablePushNotifications" class="mr-2 block text-sm text-gray-700">فعال‌سازی اعلان‌های Push</label>
              </div>
              
              <div class="border-t border-gray-200 pt-4">
                <h3 class="text-md font-medium mb-2">ارسال اعلان برای:</h3>
                
                <div class="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="notifyOnNewQuestion"
                    bind:checked={settings.notification.notifyOnNewQuestion}
                    class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <label for="notifyOnNewQuestion" class="mr-2 block text-sm text-gray-700">سوالات جدید</label>
                </div>
                
                <div class="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="notifyOnProcessedQuestion"
                    bind:checked={settings.notification.notifyOnProcessedQuestion}
                    class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <label for="notifyOnProcessedQuestion" class="mr-2 block text-sm text-gray-700">سوالات پردازش شده</label>
                </div>
                
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    id="notifyOnPublishedQuestion"
                    bind:checked={settings.notification.notifyOnPublishedQuestion}
                    class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <label for="notifyOnPublishedQuestion" class="mr-2 block text-sm text-gray-700">سوالات منتشر شده</label>
                </div>
              </div>
            </div>
          </div>
        {/if}
  
        <div class="mt-6 flex justify-end">
          <button
            on:click={saveSettings}
            class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            ذخیره تنظیمات
          </button>
        </div>
      </div>
    </div>
  </div>