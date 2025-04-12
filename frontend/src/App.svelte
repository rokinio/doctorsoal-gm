<script>
  import { onMount } from 'svelte';
  
  import MainLayout from "./layouts/MainLayout.svelte";
  import Dashboard from "./pages/Dashboard.svelte";
  import RawQuestions from "./pages/RawQuestions.svelte";
  import ProcessedQuestions from "./pages/ProcessedQuestions.svelte";
  import PublishedQuestions from "./pages/PublishedQuestions.svelte";
  import Settings from "./pages/Settings.svelte";
  import EditQuestion from "./pages/EditQuestion.svelte";

  // وضعیت فعلی صفحه
  let currentPath = '/';
  let params = {};
  
  // تابع تغییر مسیر
  function parseUrl() {
    const path = window.location.pathname;
    currentPath = path === '/' ? '/' : path.split('/')[1];
    
    // استخراج پارامترها
    if (currentPath === 'edit-question') {
      const id = path.split('/')[2];
      params = { id };
    } else {
      params = {};
    }
  }
  
  // لیسنر برای تغییر URL
  function handlePopState() {
    parseUrl();
  }
  
  onMount(() => {
    parseUrl();
    
    // اضافه کردن لیسنر برای تغییر URL
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  });
</script>

<MainLayout>
  {#if currentPath === '/'}
    <Dashboard />
  {:else if currentPath === 'raw-questions'}
    <RawQuestions />
  {:else if currentPath === 'processed-questions'}
    <ProcessedQuestions />
  {:else if currentPath === 'published-questions'}
    <PublishedQuestions />
  {:else if currentPath === 'settings'}
    <Settings />
  {:else if currentPath === 'edit-question'}
    <EditQuestion id={params.id} />
  {:else}
    <div class="p-4 text-center">
      <h1 class="text-2xl text-red-500">صفحه مورد نظر یافت نشد!</h1>
      <button 
        on:click={() => window.location.href = '/'}
        class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
      >
        بازگشت به داشبورد
      </button>
    </div>
  {/if}
</MainLayout>

<style global>
  @import "./app.css";
  
  :global(html) {
    direction: rtl;
    font-family: 'Vazirmatn', sans-serif;
  }
  
  :global(body) {
    margin: 0;
    padding: 0;
    background-color: #f8f9fa;
  }
</style>