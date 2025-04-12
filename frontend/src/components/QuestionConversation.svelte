<script>
    import Icon from '@iconify/svelte';
    import { createEventDispatcher } from 'svelte';
    
    // props
    export let conversation = [];
    export let editable = true;
    
    // dispatcher برای ارسال رویدادها به کامپوننت والد
    const dispatch = createEventDispatcher();
    
    // پیام جدید برای افزودن به گفتگو
    let newMessage = {
      sender: "doctor",
      message: ""
    };
    
    // افزودن پیام جدید به گفتگو
    function addMessage() {
      if (newMessage.message.trim() !== "") {
        dispatch('addMessage', {...newMessage});
        newMessage.message = "";
      }
    }
    
    // حذف پیام از گفتگو
    function removeMessage(index) {
      dispatch('removeMessage', { index });
    }
  </script>
  
  <div class="bg-white shadow-md rounded-lg p-6">
    <h2 class="text-lg font-semibold mb-4">گفتگو</h2>
    
    <div class="space-y-4 mb-6">
      {#each conversation as message, index}
        <div class={`p-4 rounded-lg ${message.sender === 'user' ? 'bg-gray-100' : 'bg-indigo-50'}`}>
          <div class="flex justify-between items-start mb-2">
            <div class="font-semibold flex items-center">
              <Icon icon={message.sender === 'user' ? 'mdi:account' : 'mdi:doctor'} class="ml-2 text-lg" />
              {message.sender === 'user' ? 'کاربر' : 'پزشک'}
            </div>
            {#if editable}
              <button 
                on:click={() => removeMessage(index)}
                class="text-red-600 hover:text-red-800"
                title="حذف پیام"
              >
                <Icon icon="mdi:delete" />
              </button>
            {/if}
          </div>
          <div class="whitespace-pre-line text-gray-700">{message.message}</div>
        </div>
      {/each}
      
      {#if conversation.length === 0}
        <div class="text-center py-8 text-gray-500">
          <Icon icon="mdi:chat-outline" class="text-4xl mx-auto mb-2" />
          <p>هنوز پیامی در این گفتگو وجود ندارد.</p>
        </div>
      {/if}
    </div>
    
    {#if editable}
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
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center"
          >
            <Icon icon="mdi:plus" class="ml-1" />
            افزودن پیام
          </button>
        </div>
      </div>
    {/if}
  </div>