<!-- frontend/src/pages/Dashboard.svelte -->
<script>
  import Icon from '@iconify/svelte';
  import { onMount } from 'svelte';
  import PublishedQuestionsChart from '../components/PublishedQuestionsChart.svelte';
  import { get } from '../utils/http.js'; // استفاده مستقیم از توابع

  // داده‌های نمایشی برای داشبورد
  let stats = [
    { title: 'سوالات خام', count: 0, icon: 'mdi:file-question', color: 'bg-blue-500' },
    { title: 'سوالات پردازش شده', count: 0, icon: 'mdi:file-check', color: 'bg-green-500' },
    { title: 'سوالات منتشر شده', count: 0, icon: 'mdi:file-send', color: 'bg-purple-500' },
    { title: 'بازدید کل', count: 0, icon: 'mdi:eye', color: 'bg-yellow-500' }
  ];
  
  let isLoading = true;
  let error = null;
  
  // داده‌های سوالات اخیر
  let recentQuestions = [];
  let isRecentLoading = true;
  let recentError = null;

  // دریافت آمار داشبورد
  async function fetchDashboardStats() {
    try {
      isLoading = true;
      const { data, ok, status } = await get('dashboard-stats');
      
      if (!ok) {
        throw new Error(`خطا در دریافت آمار داشبورد: ${status}`);
      }
      
      // به‌روزرسانی آمارها
      stats[0].count = data.raw_count;
      stats[1].count = data.processed_count;
      stats[2].count = data.published_count;
      stats[3].count = data.total_views;
      
      error = null;
    } catch (err) {
      console.error('خطا در دریافت آمار داشبورد:', err);
      error = err.message;
    } finally {
      isLoading = false;
    }
  }

  // دریافت سوالات اخیر
  async function fetchRecentQuestions() {
    try {
      isRecentLoading = true;
      const { data, ok, status } = await get('recent-questions');
      
      if (!ok) {
        throw new Error(`خطا در دریافت سوالات اخیر: ${status}`);
      }
      
      recentQuestions = data;
      recentError = null;
    } catch (err) {
      console.error('خطا در دریافت سوالات اخیر:', err);
      recentError = err.message;
    } finally {
      isRecentLoading = false;
    }
  }
  
  // حرکت به صفحه جزئیات سوال
  function goToQuestion(id) {
    window.location.href = `/edit-question/${id}`;
  }
  
  onMount(() => {
    fetchDashboardStats();
    fetchRecentQuestions();
  });
</script>
  
<div class="container mx-auto">
  <!-- کارت‌های آماری -->
  {#if isLoading}
    <div class="flex justify-center items-center h-24">
      <Icon icon="mdi:loading" class="text-3xl animate-spin text-indigo-600" />
    </div>
  {:else if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      <p>{error}</p>
      <button 
        on:click={fetchDashboardStats}
        class="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
      >
        تلاش مجدد
      </button>
    </div>
  {:else}
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
  {/if}
  
  <div class="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
    <!-- نمودار آمار سوالات -->
    <PublishedQuestionsChart />
    
    <!-- سوالات اخیر -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">سوالات اخیر</h2>
        <button 
          on:click={() => window.location.href = '/raw-questions'}
          class="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
        >
          مشاهده همه
          <Icon icon="mdi:chevron-left" class="mr-1" />
        </button>
      </div>
      
      {#if isRecentLoading}
        <div class="flex justify-center items-center h-40">
          <Icon icon="mdi:loading" class="text-3xl animate-spin text-indigo-600" />
        </div>
      {:else if recentError}
        <div class="bg-red-100 text-red-700 p-4 rounded-lg">
          <p>{recentError}</p>
          <button 
            on:click={fetchRecentQuestions}
            class="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            تلاش مجدد
          </button>
        </div>
      {:else if recentQuestions.length === 0}
        <div class="p-8 text-center text-gray-500">
          <p>هیچ سوالی یافت نشد</p>
        </div>
      {:else}
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
                      ${question.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        question.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                        question.status === 'published' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'}`}>
                      {question.status === 'pending' ? 'خام' : 
                       question.status === 'processing' ? 'پردازش شده' : 
                       question.status === 'published' ? 'منتشر شده' : 
                       question.status}
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
      {/if}
    </div>
  </div>
</div>