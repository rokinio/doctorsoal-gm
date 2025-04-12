<script>
  import Icon from '@iconify/svelte';
  import { onMount } from 'svelte';
  import { API_BASE_URL } from '../config.js';
  
  // پارامترهای URL برای دریافت شناسه سوال
  export let id;
  
  // داده‌های سوال
  let question = {
    id: 0,
    question: "",
    conversation: [],
    category_id: null,
    source: "",
    status: "",
    original_viewer_count: 0,
    category: null
  };
  
  // گزینه‌های دسته‌بندی
  let categories = [];
  
  // متغیرهای لودینگ و خطا
  let isLoading = true;
  let error = null;
  
  // پیام جدید برای افزودن به گفتگو
  let newMessage = {
    sender: "doctor",
    message: ""
  };
  
  // دریافت اطلاعات سوال
  async function fetchQuestion() {
    isLoading = true;
    error = null;
    
    try {
      const response = await fetch(`${API_BASE_URL}/raw-questions/${id}`);
      
      if (!response.ok) {
        throw new Error(`خطا در دریافت اطلاعات سوال: ${response.status}`);
      }
      
      question = await response.json();
      
      // اطمینان از وجود آرایه گفتگو
      if (!Array.isArray(question.conversation)) {
        question.conversation = [];
      }
      
    } catch (err) {
      console.error('خطا در دریافت اطلاعات سوال:', err);
      error = err.message;
    } finally {
      isLoading = false;
    }
  }
  
  // دریافت دسته‌بندی‌ها
  async function fetchCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      
      if (!response.ok) {
        throw new Error(`خطا در دریافت دسته‌بندی‌ها: ${response.status}`);
      }
      
      categories = await response.json();
    } catch (err) {
      console.error('خطا در دریافت دسته‌بندی‌ها:', err);
    }
  }
  
  // افزودن پیام جدید به گفتگو
  function addMessage() {
    if (newMessage.message.trim() !== "") {
      question.conversation = [...question.conversation, {...newMessage}];
      newMessage.message = "";
    }
  }
  
  // حذف پیام از گفتگو
  function removeMessage(index) {
    question.conversation = question.conversation.filter((_, i) => i !== index);
  }
  
  // ذخیره تغییرات سوال
  async function saveQuestion() {
    try {
      const response = await fetch(`${API_BASE_URL}/raw-questions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(question)
      });
      
      if (!response.ok) {
        throw new Error(`خطا در ذخیره سوال: ${response.status}`);
      }
      
      alert('سوال با موفقیت ذخیره شد.');
      window.history.back(); // استفاده از history API به جای navigate
    } catch (err) {
      console.error('خطا در ذخیره سوال:', err);
      alert(`خطا در ذخیره سوال: ${err.message}`);
    }
  }
  
  // بازگشت به صفحه قبلی بدون ذخیره تغییرات
  function cancel() {
    if (confirm('آیا مطمئن هستید؟ تغییرات ذخیره نخواهد شد.')) {
      window.history.back(); // استفاده از history API به جای navigate
    }
  }
  
  onMount(() => {
    fetchQuestion();
    fetchCategories();
  });
</script>

<div class="container mx-auto">
  {#if isLoading}
    <div class="flex justify-center p-12">
      <Icon icon="mdi:loading" class="text-4xl animate-spin text-indigo-600" />
    </div>
  {:else if error}
    <div class="bg-red-100 p-4 rounded-lg mb-6">
      <p class="text-red-700">{error}</p>
    </div>
  {:else}
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">ویرایش سوال</h1>
      <div class="flex space-x-2 space-x-reverse">
        <button 
          on:click={cancel}
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          انصراف
        </button>
        <button 
          on:click={saveQuestion}
          class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          ذخیره
        </button>
      </div>
    </div>
    
    <div class="bg-white shadow-md rounded-lg p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 class="text-lg font-semibold mb-4">اطلاعات سوال</h2>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">شناسه</label>
            <input
              type="text"
              value={question.id}
              disabled
              class="w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
              />
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">موضوع</label>
              <input
                type="text"
                bind:value={question.question}
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">دسته‌بندی</label>
              <select
                bind:value={question.category_id}
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value={null}>بدون دسته‌بندی</option>
                {#each categories as category}
                  <option value={category.id}>{category.name}</option>
                {/each}
              </select>
            </div>
          </div>
          
          <div>
            <h2 class="text-lg font-semibold mb-4">اطلاعات تکمیلی</h2>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">منبع</label>
              <input
                type="text"
                bind:value={question.source}
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">وضعیت</label>
              <select
                bind:value={question.status}
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="pending">در انتظار</option>
                <option value="processing">در حال پردازش</option>
                <option value="review">بررسی</option>
                <option value="published">منتشر شده</option>
                <option value="rejected">رد شده</option>
              </select>
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">تعداد بازدید</label>
              <input
                type="number"
                bind:value={question.original_viewer_count}
                min="0"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div class="bg-white shadow-md rounded-lg p-6">
        <h2 class="text-lg font-semibold mb-4">گفتگو</h2>
        
        <div class="space-y-4 mb-6">
          {#each question.conversation as message, index}
            <div class={`p-4 rounded-lg ${message.sender === 'user' ? 'bg-gray-100' : 'bg-indigo-50'}`}>
              <div class="flex justify-between items-start mb-2">
                <div class="font-semibold">
                  {message.sender === 'user' ? 'کاربر' : 'پزشک'}
                </div>
                <button 
                  on:click={() => removeMessage(index)}
                  class="text-red-600 hover:text-red-800"
                  title="حذف پیام"
                >
                  <Icon icon="mdi:delete" />
                </button>
              </div>
              <div class="whitespace-pre-line">{message.message}</div>
            </div>
          {/each}
        </div>
        
        <div class="border-t pt-4">
          <h3 class="text-md font-medium mb-2">افزودن پیام جدید</h3>
          <div class="mb-2">
            <select
              bind:value={newMessage.sender}
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="user">کاربر</option>
              <option value="doctor">پزشک</option>
            </select>
          </div>
          <div class="mb-2">
            <textarea
              bind:value={newMessage.message}
              rows="4"
              placeholder="متن پیام را وارد کنید..."
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            ></textarea>
          </div>
          <div class="flex justify-end">
            <button 
              on:click={addMessage}
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              افزودن پیام
            </button>
          </div>
        </div>
      </div>
    {/if}
  </div>