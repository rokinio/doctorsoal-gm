<script>
    import Icon from '@iconify/svelte';
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    
    // پارامترهای URL برای دریافت شناسه سوال
    export let id;
    
    // داده‌های سوال (به صورت نمایشی)
    let question = {
      id: 0,
      trackingCode: "",
      subject: "",
      category: "",
      site: "",
      department: "",
      source: "",
      viewer: 0,
      date: {
        unix: 0,
        formatted: ""
      },
      conversation: []
    };
    
    // گزینه‌های دسته‌بندی
    let categories = [
      "پوست", "مغز و اعصاب", "آلرژی", "ارتوپدی", "گوارش", "قلب و عروق", "ریه", "روانپزشکی", "تغذیه"
    ];
    
    // گزینه‌های سایت
    let sites = [
      "سایت دکتر سلام", "کلینیک آنلاین"
    ];
    
    // گزینه‌های بخش
    let departments = [
      "پوست و مو", "مغز و اعصاب", "آلرژی", "ارتوپدی", "گوارش", "قلب و عروق", "ریه", "روانپزشکی", "تغذیه"
    ];
    
    // پیام جدید برای افزودن به گفتگو
    let newMessage = {
      sender: "doctor",
      message: ""
    };
    
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
    function saveQuestion() {
      alert(`سوال با موفقیت ذخیره شد.`);
      // اینجا عملیات ذخیره‌سازی در سرور انجام می‌شود
      
      // بازگشت به صفحه قبلی
      navigate(-1);
    }
    
    // بازگشت به صفحه قبلی بدون ذخیره تغییرات
    function cancel() {
      if (confirm('آیا مطمئن هستید؟ تغییرات ذخیره نخواهد شد.')) {
        navigate(-1);
      }
    }
    
    // بارگذاری اطلاعات سوال
    onMount(async () => {
      // در حالت واقعی، اطلاعات از سرور دریافت می‌شود
      // اینجا برای نمایش، یک نمونه داده ساختگی استفاده می‌کنیم
      
      const exampleData = {
        id: id,
        trackingCode: `QS-${12345 + parseInt(id)}`,
        subject: "مشکل پوستی و جوش صورت",
        category: "پوست",
        site: "سایت دکتر سلام",
        department: "پوست و مو",
        source: "یسشیبیسبیس",
        viewer: 513,
        date: {
          unix: 1392034667,
          formatted: "2014-02-10 15:47:47"
        },
        conversation: [
          {
            sender: "user",
            message: "با سلام و خسته نباشید خدمت آقای دکتر ،نزدیک به یک ساله روی گونم لکه قهوه ای ظاهر شده با توجه زیاد میشه دیدش ولی من به پوستم خیلی اهمیت میدم از صابون زد قارچ استفاده کردم ولی هیچ بهتر نشده ممنون میشم کمکم کنید"
          },
          {
            sender: "doctor",
            message: "سلام سامره جان\nبهتره معاینه بشی\nلک های قهوه ای علل متعددی دارد که مهمترین اقدام شناسایی علت زمینه ای آن است.\nممکنه با کرم موضعی یا لیزر اوضاع بهتر بشه\nعلی الحساب ضد آفتاب فراموشت نشه\nموفق"
          }
        ]
      };
      
      question = exampleData;
    });
  </script>
  
  <div class="container mx-auto">
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
            <label class="block text-sm font-medium text-gray-700 mb-1">کد رهگیری</label>
            <input
              type="text"
              bind:value={question.trackingCode}
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">موضوع</label>
            <input
              type="text"
              bind:value={question.subject}
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">دسته‌بندی</label>
            <select
              bind:value={question.category}
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              {#each categories as category}
                <option value={category}>{category}</option>
              {/each}
            </select>
          </div>
        </div>
        
        <div>
          <h2 class="text-lg font-semibold mb-4">اطلاعات تکمیلی</h2>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">سایت</label>
            <select
              bind:value={question.site}
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              {#each sites as site}
                <option value={site}>{site}</option>
              {/each}
            </select>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">بخش</label>
            <select
              bind:value={question.department}
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              {#each departments as department}
                <option value={department}>{department}</option>
              {/each}
            </select>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">منبع</label>
            <input
              type="text"
              bind:value={question.source}
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">تعداد بازدید</label>
            <input
              type="number"
              bind:value={question.viewer}
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
  </div>