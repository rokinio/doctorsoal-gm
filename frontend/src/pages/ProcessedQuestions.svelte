<!-- frontend/src/pages/ProcessedQuestions.svelte -->
<script>
  import Icon from '@iconify/svelte';
  import { onMount } from 'svelte';
  import { API_BASE_URL } from '../config.js';
  import { get, post, del } from '../utils/http.js'; // استفاده مستقیم از توابع
  
  // متغیرهای دیتا
  let questions = [];
  let filteredQuestions = [];
  let isLoading = true;
  let error = null;
  let categories = []; // برای نگهداری لیست دسته‌بندی‌ها
  
  // متغیرهای پیجینیشن
  let currentPage = 1;
  let totalPages = 1;
  let totalRecords = 0;
  let limit = 10;
  let limitOptions = [10, 25, 50, 100];
  let maxPageButtons = 5; // حداکثر تعداد دکمه‌های صفحه برای نمایش
  
  // وضعیت‌های مختلف سوالات
  let statuses = [
    { id: 'processing', name: 'در حال پردازش' },
    { id: 'review', name: 'بررسی' },
  ];
  
  // متغیرهای فیلتر
  let filters = {
    id: '',
    trackingCode: '',
    subject: '',
    category: '',
    site: '',
    department: '',
    status: '',
    conversationCount: ''
  };
  
  // دریافت دسته‌بندی‌ها
  async function fetchCategories() {
    try {
      const { data, ok, status } = await get('categories');
      
      if (!ok) {
        throw new Error(`خطا در دریافت دسته‌بندی‌ها: ${status}`);
      }
      
      categories = data;
    } catch (err) {
      console.error('خطا در دریافت دسته‌بندی‌ها:', err);
    }
  }
  
  // دریافت داده‌ها از API
  async function fetchQuestions() {
    isLoading = true;
    error = null;
    
    try {
      // ساخت پارامترهای URL برای فیلترها
      const searchParams = new URLSearchParams({
        page: currentPage,
        limit: limit,
        status: "processing,review" // فقط سوالات پردازش شده را دریافت می‌کنیم
      });
      
      if (filters.id) searchParams.append('id', filters.id);
      if (filters.subject) searchParams.append('search', filters.subject);
      if (filters.category) searchParams.append('category_id', filters.category);
      if (filters.status && filters.status !== '') searchParams.append('status', filters.status);
      if (filters.conversationCount) searchParams.append('conversation_count', filters.conversationCount);
      
      const { data, ok, status } = await get(`raw-questions?${searchParams.toString()}`);
      
      if (!ok) {
        throw new Error(`خطا در دریافت اطلاعات: ${status}`);
      }
      
      questions = data.data || [];
      filteredQuestions = [...questions]; // با کپی کردن آرایه کار می‌کنیم
      
      // اعمال فیلترهای محلی
      applyLocalFilters();
      
      // اطلاعات پیجینیشن
      if (data.meta) {
        totalPages = data.meta.last_page || 1;
        totalRecords = data.meta.total || 0;
        
        // اطمینان از معتبر بودن شماره صفحه جاری
        if (currentPage > totalPages && totalPages > 0) {
          currentPage = totalPages;
          // دریافت مجدد با شماره صفحه اصلاح شده
          return fetchQuestions();
        }
      }
    } catch (err) {
      console.error('خطا در دریافت سوالات پردازش شده:', err);
      error = err.message;
    } finally {
      isLoading = false;
    }
  }
  
  // اعمال فیلترهای محلی
  function applyLocalFilters() {
    if (!questions) return; // اطمینان از وجود داده
    
    filteredQuestions = questions.filter(q => {
      let matchesConversationCount = true;
      if (filters.conversationCount !== '') {
        const conversationLength = q.conversation && Array.isArray(q.conversation) ? q.conversation.length : 0;
        
        if (filters.conversationCount === 'more-than-2') {
          // بیشتر از 2 پیام
          matchesConversationCount = conversationLength > 2;
        } else if (filters.conversationCount === '2') {
          // دقیقاً 2 پیام
          matchesConversationCount = conversationLength === 2;
        } else if (filters.conversationCount === 'less-than-2') {
          // کمتر از 2 پیام
          matchesConversationCount = conversationLength < 2;
        }
      }
      
      return (
        (filters.id === '' || (q.id !== undefined && q.id !== null && q.id.toString().includes(filters.id))) &&
        (filters.trackingCode === '' || (q.tracking_code !== undefined && q.tracking_code !== null && q.tracking_code.toLowerCase().includes(filters.trackingCode.toLowerCase()))) &&
        (filters.subject === '' || (q.question !== undefined && q.question !== null && q.question.toLowerCase().includes(filters.subject.toLowerCase()))) &&
        (filters.category === '' || (q.category_id !== undefined && q.category_id !== null && q.category_id.toString() === filters.category.toString())) &&
        (filters.site === '' || (q.source !== undefined && q.source !== null && q.source.toLowerCase().includes(filters.site.toLowerCase()))) &&
        (filters.department === '' || (q.category?.name !== undefined && q.category?.name !== null && q.category?.name.toLowerCase().includes(filters.department.toLowerCase()))) &&
        (filters.status === '' || (q.status !== undefined && q.status !== null && q.status === filters.status)) &&
        matchesConversationCount
      );
    });
  }
  
  // اعمال فیلترها
  function applyFilters() {
    fetchQuestions();
  }
  
  // پاک کردن فیلترها
  function resetFilters() {
    filters = {
      id: '',
      trackingCode: '',
      subject: '',
      category: '',
      site: '',
      department: '',
      status: '',
      conversationCount: ''
    };
    
    // Make sure questions array exists before trying to copy it
    if (questions && Array.isArray(questions)) {
      filteredQuestions = [...questions]; // بازنشانی فیلترها با کپی کردن آرایه اصلی
    } else {
      filteredQuestions = [];
    }
    
    // Re-fetch questions to ensure we have fresh data
    fetchQuestions();
  }
  
  // انتشار سوال
  async function publishQuestion(id) {
    if (confirm('آیا از انتشار این سوال اطمینان دارید؟')) {
      try {
        const { data, ok, status } = await post(`raw-questions/${id}/publish`, {});
        
        if (!ok) {
          throw new Error(`خطا در انتشار سوال: ${status}`);
        }
        
        // به‌روزرسانی وضعیت سوال در لیست محلی
        const updatedQuestion = questions.find(q => q.id === id);
        if (updatedQuestion) {
          updatedQuestion.status = 'published';
          filteredQuestions = filteredQuestions.filter(q => q.id !== id); // حذف از لیست فیلتر شده
        }
        
        alert('سوال با موفقیت منتشر شد');
      } catch (err) {
        console.error('خطا در انتشار سوال:', err);
        alert(`خطا در انتشار سوال: ${err.message}`);
      }
    }
  }
  
  // ویرایش سوال
  function editQuestion(id) {
    window.location.href = `/edit-question/${id}`;
  }
  
  // حذف سوال
  async function deleteQuestion(id) {
    if (confirm('آیا از حذف این سوال اطمینان دارید؟')) {
      try {
        const { ok, status } = await del(`raw-questions/${id}`);
        
        if (!ok) {
          throw new Error(`خطا در حذف سوال: ${status}`);
        }
        
        // حذف از لیست محلی
        questions = questions.filter(q => q.id !== id);
        filteredQuestions = filteredQuestions.filter(q => q.id !== id);
        
        alert('سوال با موفقیت حذف شد');
      } catch (err) {
        console.error('خطا در حذف سوال:', err);
        alert(`خطا در حذف سوال: ${err.message}`);
      }
    }
  }
  
  // تغییر صفحه
  function changePage(page) {
    if (page < 1 || page > totalPages || page === currentPage) return;
    
    currentPage = page;
    fetchQuestions();
  }
  
  // تغییر تعداد آیتم در هر صفحه
  function changeLimit(newLimit) {
    if (newLimit === limit) return;
    
    // Calculate which record we're viewing to maintain position
    const currentFirstRecord = (currentPage - 1) * limit + 1;
    
    limit = newLimit;
    
    // Calculate new page to show same records
    currentPage = Math.max(1, Math.ceil(currentFirstRecord / limit));
    
    fetchQuestions();
  }
  
  // محاسبه دکمه‌های صفحه‌بندی
  function getPageButtons() {
    if (totalPages <= 1) return [];
    
    let buttons = [];
    
    if (totalPages <= maxPageButtons) {
      // If total pages is less than max buttons, show all pages
      for (let i = 1; i <= totalPages; i++) {
        buttons.push({ type: 'page', value: i });
      }
    } else {
      // Always include first page
      buttons.push({ type: 'page', value: 1 });
      
      // Calculate middle range
      let leftOffset = Math.floor((maxPageButtons - 2) / 2);
      let rightOffset = maxPageButtons - 3 - leftOffset;
      
      let startPage = Math.max(2, currentPage - leftOffset);
      let endPage = Math.min(totalPages - 1, currentPage + rightOffset);
      
      // Adjust if we're near the beginning
      if (startPage <= 2) {
        endPage = Math.min(totalPages - 1, maxPageButtons - 1);
      }
      
      // Adjust if we're near the end
      if (endPage >= totalPages - 1) {
        startPage = Math.max(2, totalPages - maxPageButtons + 2);
      }
      
      // Add ellipsis if needed
      if (startPage > 2) {
        buttons.push({ type: 'ellipsis' });
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        buttons.push({ type: 'page', value: i });
      }
      
      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        buttons.push({ type: 'ellipsis' });
      }
      
      // Always include last page
      buttons.push({ type: 'page', value: totalPages });
    }
    
    return buttons;
  }
  
  onMount(() => {
    fetchCategories();
    fetchQuestions();
  });
</script>

<div class="container mx-auto">
  <!-- بخش فیلترها -->
  <div class="bg-white rounded-lg shadow-md p-4 mb-6">
    <div class="flex flex-wrap -mx-2">
      <div class="w-full md:w-1/2 lg:w-1/6 px-2 mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">شناسه</label>
        <input
          type="text"
          bind:value={filters.id}
          on:input={applyFilters}
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div class="w-full md:w-1/2 lg:w-1/6 px-2 mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">کد رهگیری</label>
        <input
          type="text"
          bind:value={filters.trackingCode}
          on:input={applyFilters}
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div class="w-full md:w-1/2 lg:w-1/6 px-2 mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">موضوع</label>
        <input
          type="text"
          bind:value={filters.subject}
          on:input={applyFilters}
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div class="w-full md:w-1/2 lg:w-1/6 px-2 mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">دسته‌بندی</label>
        <select
          bind:value={filters.category}
          on:change={applyFilters}
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">همه دسته‌بندی‌ها</option>
          {#each categories as category}
            <option value={category.id}>{category.name}</option>
          {/each}
        </select>
      </div>
      <div class="w-full md:w-1/2 lg:w-1/6 px-2 mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">وضعیت</label>
        <select
          bind:value={filters.status}
          on:change={applyFilters}
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">همه وضعیت‌ها</option>
          {#each statuses as status}
            <option value={status.id}>{status.name}</option>
          {/each}
        </select>
      </div>
      <div class="w-full md:w-1/2 lg:w-1/6 px-2 mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">سایت</label>
        <input
          type="text"
          bind:value={filters.site}
          on:input={applyFilters}
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div class="w-full md:w-1/2 lg:w-1/6 px-2 mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">تعداد مکالمه</label>
        <select
          bind:value={filters.conversationCount}
          on:change={applyFilters}
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">همه</option>
          <option value="more-than-2">بیشتر از 2 پیام</option>
          <option value="2">دقیقاً 2 پیام</option>
          <option value="less-than-2">کمتر از 2 پیام</option>
        </select>
      </div>
    </div>
    <div class="flex justify-end">
      <button 
        on:click={resetFilters}
        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
      >
        پاک کردن فیلترها
      </button>
    </div>
  </div>

  {#if isLoading}
    <div class="flex justify-center p-12">
      <Icon icon="mdi:loading" class="text-4xl animate-spin text-indigo-600" />
    </div>
  {:else if error}
    <div class="bg-red-100 p-4 rounded-lg mb-6">
      <p class="text-red-700">{error}</p>
      <button 
        on:click={fetchQuestions}
        class="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
      >
        تلاش مجدد
      </button>
    </div>
  {:else}
    <!-- جدول سوالات -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                شناسه
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                موضوع
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                دسته‌بندی
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                منبع
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                وضعیت
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                مکالمه
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                عملیات
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#each filteredQuestions as question}
              <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{question.id}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{question.question}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{question.category?.name || 'بدون دسته‌بندی'}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{question.source || '-'}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${question.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      question.status === 'review' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'}`}>
                    {question.status === 'processing' ? 'در حال پردازش' :
                     question.status === 'review' ? 'بررسی' :
                     question.status}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${question.conversation && Array.isArray(question.conversation) && question.conversation.length > 1 ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                    {question.conversation && Array.isArray(question.conversation) && question.conversation.length > 1 ? 
                      `${question.conversation.length} پیام` : 
                      'بدون مکالمه'}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-3 space-x-reverse">
                    <button
                      on:click={() => publishQuestion(question.id)}
                      class="text-green-600 hover:text-green-900"
                      title="انتشار"
                    >
                      <Icon icon="mdi:cloud-upload" class="text-lg" />
                    </button>
                    <button
                      on:click={() => editQuestion(question.id)}
                      class="text-blue-600 hover:text-blue-900"
                      title="ویرایش"
                    >
                      <Icon icon="mdi:pencil" class="text-lg" />
                    </button>
                    <button
                      on:click={() => deleteQuestion(question.id)}
                      class="text-red-600 hover:text-red-900"
                      title="حذف"
                    >
                      <Icon icon="mdi:delete" class="text-lg" />
                    </button>
                  </div>
                </td>
              </tr>
            {/each}
            
            {#if filteredQuestions.length === 0}
              <tr>
                <td colspan="7" class="px-6 py-4 text-center text-gray-500">
                  سوال پردازش شده‌ای یافت نشد
                </td>
              </tr>
            {/if}
          </tbody>
        </table>
      </div>
      
      {#if totalPages > 0}
        <div class="px-4 py-3 flex flex-wrap items-center justify-between border-t border-gray-200">
          <div class="flex items-center mb-2 sm:mb-0">
            <label class="text-sm text-gray-700 ml-2">تعداد در هر صفحه:</label>
            <select 
              on:change={(e) => changeLimit(Number(e.target.value))}
              value={limit}
              class="border rounded-md px-2 py-1 text-sm"
            >
              {#each limitOptions as option}
                <option value={option}>{option}</option>
              {/each}
            </select>
          </div>
          
          <div class="flex-1 flex justify-center mb-2 sm:mb-0">
            <div class="flex space-x-2 space-x-reverse">
              <button
                on:click={() => changePage(1)}
                disabled={currentPage === 1}
                class="px-2 py-1 border rounded-md {currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}"
                title="صفحه اول"
              >
                <Icon icon="mdi:chevron-double-right" />
              </button>
              
              <button
                on:click={() => changePage(currentPage - 1)}
                disabled={currentPage === 1}
                class="px-2 py-1 border rounded-md {currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}"
                title="صفحه قبلی"
              >
                <Icon icon="mdi:chevron-right" />
              </button>

              {#each getPageButtons() as button}
                {#if button.type === 'ellipsis'}
                  <span class="px-2 py-1 text-gray-500">...</span>
                {:else}
                  <button
                    on:click={() => changePage(button.value)}
                    class="px-3 py-1 border rounded-md {currentPage === button.value ? 'bg-indigo-500 text-white' : 'hover:bg-gray-50'}"
                  >
                    {button.value}
                  </button>
                {/if}
              {/each}

              <button
                on:click={() => changePage(currentPage + 1)}
                disabled={currentPage === totalPages}
                class="px-2 py-1 border rounded-md {currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}"
                title="صفحه بعدی"
              >
                <Icon icon="mdi:chevron-left" />
              </button>
              
              <button
                on:click={() => changePage(totalPages)}
                disabled={currentPage === totalPages}
                class="px-2 py-1 border rounded-md {currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}"
                title="صفحه آخر"
              >
                <Icon icon="mdi:chevron-double-left" />
              </button>
            </div>
          </div>
          
          <div class="text-sm text-gray-700 text-center sm:text-right">
            نمایش {(currentPage - 1) * limit + 1} تا {Math.min(currentPage * limit, totalRecords)} از {totalRecords} مورد
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>