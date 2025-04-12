<script>
    import Icon from '@iconify/svelte';
    import { navigate } from 'svelte-routing';
    import { onMount } from 'svelte';
    
    // داده‌های نمایشی برای داشبورد
    let stats = [
      { title: 'سوالات خام', count: 124, icon: 'mdi:file-question', color: 'bg-blue-500' },
      { title: 'سوالات پردازش شده', count: 85, icon: 'mdi:file-check', color: 'bg-green-500' },
      { title: 'سوالات منتشر شده', count: 67, icon: 'mdi:file-send', color: 'bg-purple-500' },
      { title: 'بازدید کل', count: 12453, icon: 'mdi:eye', color: 'bg-yellow-500' }
    ];
    
    // داده‌های نمودار (نمایشی)
    let chartData = [
      { day: 'شنبه', count: 12 },
      { day: 'یکشنبه', count: 19 },
      { day: 'دوشنبه', count: 14 },
      { day: 'سه‌شنبه', count: 27 },
      { day: 'چهارشنبه', count: 21 },
      { day: 'پنج‌شنبه', count: 15 },
      { day: 'جمعه', count: 8 }
    ];
    
    // محاسبه حداکثر مقدار برای نمودار
    let maxChartValue = Math.max(...chartData.map(item => item.count));
    
    // داده‌های نمایشی برای سوالات اخیر
    let recentQuestions = [
      { id: 1, title: 'مشکل پوستی و جوش صورت', category: 'پوست', status: 'raw', date: '۱۴۰۲/۰۲/۲۵' },
      { id: 2, title: 'سردرد مزمن و مشکلات خواب', category: 'مغز و اعصاب', status: 'processed', date: '۱۴۰۲/۰۲/۲۴' },
      { id: 3, title: 'آلرژی فصلی و آبریزش بینی', category: 'آلرژی', status: 'published', date: '۱۴۰۲/۰۲/۲۳' },
      { id: 4, title: 'درد مفاصل زانو', category: 'ارتوپدی', status: 'processed', date: '۱۴۰۲/۰۲/۲۲' },
      { id: 5, title: 'مشکل گوارشی و نفخ شکم', category: 'گوارش', status: 'published', date: '۱۴۰۲/۰۲/۲۱' }
    ];
    
    // داده‌های نمایشی برای فعالیت‌های اخیر
    let recentActivities = [
      { id: 1, user: 'محمد حسینی', action: 'یک سوال جدید ثبت کرد', time: '۱۰ دقیقه پیش', icon: 'mdi:plus', iconColor: 'text-green-500' },
      { id: 2, user: 'زهرا محمدی', action: 'یک سوال را پردازش کرد', time: '۳۰ دقیقه پیش', icon: 'mdi:check', iconColor: 'text-blue-500' },
      { id: 3, user: 'علی اکبری', action: 'یک سوال را منتشر کرد', time: '۱ ساعت پیش', icon: 'mdi:cloud-upload', iconColor: 'text-purple-500' },
      { id: 4, user: 'مریم احمدی', action: 'تنظیمات را بروزرسانی کرد', time: '۲ ساعت پیش', icon: 'mdi:cog', iconColor: 'text-gray-500' },
      { id: 5, user: 'رضا کریمی', action: 'یک سوال را حذف کرد', time: '۳ ساعت پیش', icon: 'mdi:delete', iconColor: 'text-red-500' }
    ];
    
    // حرکت به صفحه جزئیات سوال
    function goToQuestion(id) {
      navigate(`/edit-question/${id}`);
    }
    
    onMount(() => {
      // اینجا می‌توانید از API برای دریافت داده‌های واقعی استفاده کنید
    });
  </script>
  
  <div class="container mx-auto">
    <!-- کارت‌های آماری -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {#each stats as stat}
        <div class="bg-white rounded-lg shadow-md p-6 flex items-center">
          <div class={`${stat.color} text-white p-3 rounded-full`}>
            <Icon icon={stat.icon} class="text-2xl" />
          </div>
          <div class="mr-4">
            <div class="text-gray-500 text-sm">{stat.title}</div>
            <div class="text-2xl font-bold">{stat.count}</div>
          </div>
        </div>
      {/each}
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- نمودار آمار سوالات -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-lg font-semibold mb-4">آمار سوالات هفته اخیر</h2>
        <div class="h-64 flex items-end justify-between">
          {#each chartData as item}
            <div class="flex flex-col items-center" style="width: calc(100% / {chartData.length});">
              <div class="bg-blue-500 w-full rounded-t-sm transition-all duration-500" style="height: {(item.count / maxChartValue) * 80}%"></div>
              <div class="mt-2 text-xs text-center">{item.day}</div>
              <div class="text-xs font-bold">{item.count}</div>
            </div>
          {/each}
        </div>
      </div>
      
      <!-- فعالیت‌های اخیر -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-lg font-semibold mb-4">فعالیت‌های اخیر</h2>
        <div class="space-y-4">
          {#each recentActivities as activity}
            <div class="flex items-start">
              <div class={`${activity.iconColor} mt-1`}>
                <Icon icon={activity.icon} class="text-lg" />
              </div>
              <div class="mr-3 flex-1">
                <div class="flex justify-between">
                  <div>
                    <span class="font-medium">{activity.user}</span>
                    <span class="text-gray-600 mr-1">{activity.action}</span>
                  </div>
                  <span class="text-sm text-gray-500">{activity.time}</span>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
    
    <!-- سوالات اخیر -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">سوالات اخیر</h2>
        <button 
          on:click={() => navigate('/raw-questions')}
          class="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
        >
          مشاهده همه
          <Icon icon="mdi:chevron-left" class="mr-1" />
        </button>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                عنوان
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                دسته‌بندی
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                وضعیت
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                تاریخ
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                عملیات
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#each recentQuestions as question}
              <tr class="hover:bg-gray-50 cursor-pointer" on:click={() => goToQuestion(question.id)}>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{question.title}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{question.category}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${question.status === 'raw' ? 'bg-yellow-100 text-yellow-800' : 
                      question.status === 'processed' ? 'bg-blue-100 text-blue-800' : 
                      'bg-green-100 text-green-800'}`}>
                    {question.status === 'raw' ? 'خام' : 
                     question.status === 'processed' ? 'پردازش شده' : 
                     'منتشر شده'}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {question.date}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                  <button 
                    on:click|stopPropagation={() => goToQuestion(question.id)}
                    class="text-indigo-600 hover:text-indigo-900"
                  >
                    <Icon icon="mdi:pencil" class="text-lg" />
                  </button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>