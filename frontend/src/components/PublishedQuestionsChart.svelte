<script>
    import { onMount } from 'svelte';
    import Icon from '@iconify/svelte';
    import { API_BASE_URL } from '../config.js';
    import { format, subDays } from 'date-fns-jalali';
    
    // پراپ‌ها
    export let title = "آمار سوالات منتشر شده اخیر";
    
    // وضعیت‌های داخلی
    let chartData = [];
    let maxValue = 0;
    let isLoading = true;
    let error = null;
    
    // دریافت داده‌های نمودار
    async function fetchData() {
      try {
        isLoading = true;
        const response = await fetch(`${API_BASE_URL}/published-stats`);
        
        if (!response.ok) {
          throw new Error(`خطا در دریافت آمار: ${response.status}`);
        }
        
        const data = await response.json();
        
        // تبدیل تاریخ‌ها به تاریخ جلالی
        chartData = data.map(item => {
          const date = new Date(item.date);
          return {
            day: format(date, 'EEEE'), // روز هفته به فارسی
            date: format(date, 'yyyy/MM/dd'), // تاریخ جلالی
            count: item.count
          };
        });
        
        // محاسبه بیشترین مقدار برای مقیاس نمودار
        maxValue = Math.max(...chartData.map(item => item.count));
        
        error = null;
      } catch (err) {
        console.error('خطا در دریافت آمار:', err);
        error = err.message;
      } finally {
        isLoading = false;
      }
    }
    
    onMount(fetchData);
  </script>
  
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-lg font-semibold mb-4">{title}</h2>
    
    {#if isLoading}
      <div class="flex justify-center items-center h-64">
        <Icon icon="mdi:loading" class="text-3xl animate-spin text-indigo-600" />
      </div>
    {:else if error}
      <div class="bg-red-100 text-red-700 p-4 rounded-lg h-64 flex items-center justify-center">
        <p>{error}</p>
      </div>
    {:else if chartData.length === 0 || maxValue === 0}
      <div class="h-64 flex items-center justify-center text-gray-500">
        <p>داده‌ای برای نمایش وجود ندارد</p>
      </div>
    {:else}
      <div class="h-64 flex items-end justify-between">
        {#each chartData as item}
          <div class="flex flex-col items-center" style="width: calc(100% / {chartData.length});">
            <div 
              class="bg-purple-500 w-full rounded-t-sm transition-all duration-500" 
              style="height: {(item.count / maxValue) * 80}%">
            </div>
            <div class="mt-2 text-xs text-center">{item.day}</div>
            <div class="text-xs font-bold">{item.count}</div>
          </div>
        {/each}
      </div>
    {/if}
    {#if error}
  <div class="bg-red-100 text-red-700 p-4 rounded-lg h-64 flex items-center justify-center">
    <div>
      <p class="font-bold mb-2">خطا در دریافت آمار:</p>
      <p>{error}</p>
      <button 
        on:click={fetchData} 
        class="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
      >
        تلاش مجدد
      </button>
    </div>
  </div>
{/if}
  </div>