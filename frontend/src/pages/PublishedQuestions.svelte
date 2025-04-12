<script>
    import Icon from '@iconify/svelte';
    import { navigate } from 'svelte-routing';
    import { onMount } from 'svelte';
    
    // داده‌های نمایشی برای جدول
    let questions = [
      { id: 1, trackingCode: "QS-12345", subject: "مشکل پوستی و جوش صورت", category: "پوست", site: "سایت دکتر سلام", department: "پوست و مو", views: 324, publishDate: "۱۴۰۲/۰۲/۲۵" },
      { id: 2, trackingCode: "QS-12346", subject: "سردرد مزمن و مشکلات خواب", category: "مغز و اعصاب", site: "کلینیک آنلاین", department: "مغز و اعصاب", views: 189, publishDate: "۱۴۰۲/۰۲/۲۴" },
      { id: 3, trackingCode: "QS-12347", subject: "آلرژی فصلی و آبریزش بینی", category: "آلرژی", site: "سایت دکتر سلام", department: "آلرژی", views: 531, publishDate: "۱۴۰۲/۰۲/۲۳" },
      { id: 4, trackingCode: "QS-12348", subject: "درد مفاصل زانو", category: "ارتوپدی", site: "کلینیک آنلاین", department: "ارتوپدی", views: 420, publishDate: "۱۴۰۲/۰۲/۲۲" },
      { id: 5, trackingCode: "QS-12349", subject: "مشکل گوارشی و نفخ شکم", category: "گوارش", site: "سایت دکتر سلام", department: "گوارش", views: 275, publishDate: "۱۴۰۲/۰۲/۲۱" }
    ];
    
    // متغیرهای فیلتر
    let filters = {
      id: '',
      trackingCode: '',
      subject: '',
      category: '',
      site: '',
      department: '',
      publishDate: ''
    };
    
    let filteredQuestions = questions;
    
    // اعمال فیلترها
    function applyFilters() {
      filteredQuestions = questions.filter(q => {
        return (
          (filters.id === '' || q.id.toString().includes(filters.id)) &&
          (filters.trackingCode === '' || q.trackingCode.toLowerCase().includes(filters.trackingCode.toLowerCase())) &&
          (filters.subject === '' || q.subject.toLowerCase().includes(filters.subject.toLowerCase())) &&
          (filters.category === '' || q.category.toLowerCase().includes(filters.category.toLowerCase())) &&
          (filters.site === '' || q.site.toLowerCase().includes(filters.site.toLowerCase())) &&
          (filters.department === '' || q.department.toLowerCase().includes(filters.department.toLowerCase())) &&
          (filters.publishDate === '' || q.publishDate.includes(filters.publishDate))
        );
      });
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
        publishDate: ''
      };
      filteredQuestions = questions;
    }
    
    // ویرایش سوال
    function editQuestion(id) {
      navigate(`/edit-question/${id}`);
    }
    
    // مشاهده آمار
    function viewStats(id) {
      alert(`نمایش آمار برای سوال با شناسه ${id}`);
      // اینجا می‌توانید به صفحه آمار هدایت کنید
    }
    
    // حذف از انتشار
    function unpublishQuestion(id) {
      if (confirm('آیا از حذف انتشار این سوال اطمینان دارید؟')) {
        alert(`سوال با شناسه ${id} از انتشار خارج شد`);
        // اینجا عملیات حذف از انتشار انجام می‌شود
      }
    }
    
    onMount(() => {
      // اینجا می‌توانید از API برای دریافت داده‌ها استفاده کنید
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
          <input
            type="text"
            bind:value={filters.category}
            on:input={applyFilters}
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
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
          <label class="block text-sm font-medium text-gray-700 mb-1">تاریخ انتشار</label>
          <input
            type="text"
            bind:value={filters.publishDate}
            on:input={applyFilters}
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
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
                کد رهگیری
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                موضوع
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                دسته‌بندی
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                سایت
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                بازدید
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                تاریخ انتشار
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
                  <div class="text-sm text-gray-900">{question.trackingCode}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{question.subject}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{question.category}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{question.site}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{question.views}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{question.publishDate}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-3 space-x-reverse">
                    <button
                      on:click={() => viewStats(question.id)}
                      class="text-indigo-600 hover:text-indigo-900"
                      title="مشاهده آمار"
                    >
                      <Icon icon="mdi:chart-line" class="text-lg" />
                    </button>
                    <button
                      on:click={() => editQuestion(question.id)}
                      class="text-blue-600 hover:text-blue-900"
                      title="ویرایش"
                    >
                      <Icon icon="mdi:pencil" class="text-lg" />
                    </button>
                    <button
                      on:click={() => unpublishQuestion(question.id)}
                      class="text-red-600 hover:text-red-900"
                      title="حذف از انتشار"
                    >
                      <Icon icon="mdi:cloud-off" class="text-lg" />
                    </button>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>