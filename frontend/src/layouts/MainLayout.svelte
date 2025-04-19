<script>
  import Icon from '@iconify/svelte';
  import { onMount } from 'svelte';
  import { logout, user } from '../utils/auth.js';
  
  let sidebarOpen = true;
  let currentPage = '';
  let username = '';
  
  onMount(() => {
    // تشخیص صفحه فعلی از URL
    const path = window.location.pathname;
    currentPage = path === '/' ? 'dashboard' : path.slice(1).split('/')[0];
  });
  
  // دریافت نام کاربری از استور
  user.subscribe(value => {
    if (value) {
      username = value.username;
    }
  });
  
  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }
  
  function handleNavigation(route) {
    currentPage = route;
    window.location.href = '/' + (route === 'dashboard' ? '' : route);
  }
  
  // تابع خروج از سیستم
  function handleLogout() {
    logout();
    window.location.href = '/login';
  }
  
  const menuItems = [
    { id: 'dashboard', title: 'داشبورد', icon: 'mdi:view-dashboard' },
    { id: 'raw-questions', title: 'سوالات خام', icon: 'mdi:file-question' },
    { id: 'processed-questions', title: 'سوالات پردازش شده', icon: 'mdi:file-check' },
    { id: 'published-questions', title: 'سوالات منتشر شده', icon: 'mdi:file-send' },
    { id: 'settings', title: 'تنظیمات', icon: 'mdi:cog' }
  ];
</script>

<div class="flex h-screen overflow-hidden bg-gray-100">
  <!-- Sidebar (منو کناری) -->
  <div class={`${sidebarOpen ? 'w-64' : 'w-20'} bg-indigo-800 text-white transition-all duration-300 ease-in-out`}>
    <!-- Logo and brand -->
    <div class="p-4 flex items-center justify-between">
      <div class="flex items-center">
        <Icon icon="mdi:medical-bag" class="text-2xl text-white" />
        {#if sidebarOpen}
          <span class="mr-2 font-bold text-lg">سامانه سوالات</span>
        {/if}
      </div>
      <button on:click={toggleSidebar} class="text-white hover:text-gray-200">
        <Icon icon={sidebarOpen ? "mdi:chevron-right" : "mdi:chevron-left"} class="text-xl" />
      </button>
    </div>
    
    <!-- User info -->
    {#if sidebarOpen}

    {:else}
      <div class="px-4 py-2 border-t border-indigo-700 flex justify-center">
      </div>
    {/if}
    
    <!-- Menu items -->
    <div class="mt-8">
      {#each menuItems as item}
        <div 
          class={`flex items-center py-3 px-4 cursor-pointer ${currentPage === item.id ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`}
          on:click={() => handleNavigation(item.id)}
        >
          <Icon icon={item.icon} class="text-xl" />
          {#if sidebarOpen}
            <span class="mr-3">{item.title}</span>
          {/if}
        </div>
      {/each}
    </div>
  </div>
  
  <!-- Main content -->
  <div class="flex-1 flex flex-col overflow-hidden">
    <!-- Top navigation bar -->
    <header class="bg-white shadow-sm">
      <div class="flex items-center justify-between p-4">
        <div class="flex items-center">
          <div class="text-lg font-semibold text-gray-800">
            {menuItems.find(item => item.id === currentPage)?.title || 'داشبورد'}
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <button class="p-2 rounded-full hover:bg-gray-100">
            <Icon icon="mdi:bell" class="text-xl" />
          </button>
          <button on:click={handleLogout} class="flex items-center gap-1 p-2 rounded-full hover:bg-gray-100">
            <span class="text-sm text-black">{username}</span>
            <Icon icon="mdi:logout" class="text-xl" />
          </button>
        </div>
      </div>
      
      <!-- Tab bar -->
      <div class="px-4 border-b border-gray-200">
        <div class="flex h-10">
          <div class="flex items-center px-4 py-2 border-b-2 border-indigo-500 text-indigo-600">
            <span>{menuItems.find(item => item.id === currentPage)?.title || 'داشبورد'}</span>
          </div>
        </div>
      </div>
    </header>
    
    <!-- Page content -->
    <main class="flex-1 overflow-y-auto p-4">
      <slot></slot>
    </main>
  </div>
</div>