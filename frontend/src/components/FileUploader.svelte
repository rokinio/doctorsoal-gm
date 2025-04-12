<script>
    import Icon from '@iconify/svelte';
    import { createEventDispatcher } from 'svelte';
    
    // props
    export let accept = "image/*"; // پذیرش انواع فایل به صورت پیش‌فرض
    export let multiple = false; // امکان آپلود چندگانه
    export let maxFileSize = 5 * 1024 * 1024; // حداکثر حجم فایل (5 مگابایت پیش‌فرض)
    export let files = []; // آرایه فایل‌های آپلود شده
    
    // dispatcher برای ارسال رویدادها به کامپوننت والد
    const dispatch = createEventDispatcher();
    
    // رفرنس به المان input
    let fileInput;
    
    // متغیرهای وضعیت
    let isDragging = false;
    let errors = [];
    
    // پردازش فایل‌های انتخابی
    function handleFiles(selectedFiles) {
      errors = [];
      
      if (!selectedFiles || selectedFiles.length === 0) return;
      
      const newFiles = Array.from(selectedFiles).map(file => {
        // بررسی حجم فایل
        if (file.size > maxFileSize) {
          errors.push(`فایل ${file.name} بزرگتر از حداکثر حجم مجاز (${maxFileSize / 1024 / 1024} مگابایت) است.`);
          return null;
        }
        
        return {
          id: Date.now() + Math.random().toString(36).substring(2, 9),
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
        };
      }).filter(Boolean);
      
      if (newFiles.length > 0) {
        if (!multiple) {
          // در حالت تک فایلی، فایل قبلی را حذف می‌کنیم
          files = [newFiles[0]];
        } else {
          files = [...files, ...newFiles];
        }
        
        dispatch('filesChanged', { files });
      }
    }
    
    // رویداد انتخاب فایل
    function handleSelectFiles() {
      fileInput.click();
    }
    
    // رویداد تغییر فایل
    function handleFileInputChange(event) {
      handleFiles(event.target.files);
      event.target.value = null; // ریست کردن input برای امکان انتخاب مجدد همان فایل
    }
    
    // رویدادهای درگ و دراپ
    function handleDragOver(event) {
      event.preventDefault();
      isDragging = true;
    }
    
    function handleDragLeave() {
      isDragging = false;
    }
    
    function handleDrop(event) {
      event.preventDefault();
      isDragging = false;
      
      const droppedFiles = event.dataTransfer.files;
      handleFiles(droppedFiles);
    }
    
    // حذف فایل
    function removeFile(fileId) {
      const fileToRemove = files.find(f => f.id === fileId);
      if (fileToRemove && fileToRemove.preview) {
        URL.revokeObjectURL(fileToRemove.preview); // آزادسازی حافظه پیش‌نمایش
      }
      
      files = files.filter(f => f.id !== fileId);
      dispatch('filesChanged', { files });
    }
    
    // پاکسازی حافظه هنگام حذف کامپوننت
    function cleanup() {
      files.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    }
    
    // تبدیل سایز به فرمت خوانا
    function formatFileSize(bytes) {
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
  </script>
  
  <svelte:window on:beforeunload={cleanup} />
  
  <div class="w-full">
    <div 
      class={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors duration-200 
      ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'}`}
      on:dragover={handleDragOver}
      on:dragleave={handleDragLeave}
      on:drop={handleDrop}
      on:click={handleSelectFiles}
    >
      <input 
        type="file"
        bind:this={fileInput}
        {accept}
        {multiple}
        class="hidden"
        on:change={handleFileInputChange}
      />
      
      <Icon icon="mdi:cloud-upload" class="text-4xl text-indigo-500 mx-auto mb-2" />
      <p class="text-gray-700 mb-1">فایل‌ها را اینجا رها کنید یا کلیک کنید</p>
      <p class="text-sm text-gray-500">
        {multiple ? 'می‌توانید چندین فایل را انتخاب کنید' : 'تنها یک فایل قابل آپلود است'}
        (حداکثر {maxFileSize / 1024 / 1024} مگابایت)
      </p>
    </div>
    
    {#if errors.length > 0}
      <div class="mt-2 text-red-600 text-sm">
        {#each errors as error}
          <div class="flex items-center">
            <Icon icon="mdi:alert-circle" class="ml-1" />
            {error}
          </div>
        {/each}
      </div>
    {/if}
    
    {#if files.length > 0}
      <div class="mt-4">
        <h3 class="text-sm font-medium text-gray-700 mb-2">فایل‌های انتخاب شده:</h3>
        <ul class="space-y-2">
          {#each files as file}
            <li class="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-10 h-10 flex-shrink-0 overflow-hidden rounded mr-3">
                  {#if file.preview}
                    <img src={file.preview} alt={file.name} class="w-full h-full object-cover" />
                  {:else}
                    <div class="w-full h-full bg-gray-200 flex items-center justify-center">
                      <Icon 
                        icon={
                          file.type.includes('pdf') ? 'mdi:file-pdf' :
                          file.type.includes('word') ? 'mdi:file-word' :
                          file.type.includes('excel') ? 'mdi:file-excel' :
                          'mdi:file-document'
                        } 
                        class="text-xl text-gray-500" 
                      />
                    </div>
                  {/if}
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-700">{file.name}</div>
                  <div class="text-xs text-gray-500">{formatFileSize(file.size)}</div>
                </div>
              </div>
              
              <button 
                on:click|stopPropagation={() => removeFile(file.id)}
                class="text-red-500 hover:text-red-700 p-1"
              >
                <Icon icon="mdi:delete" class="text-lg" />
              </button>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  </div>