<script lang="ts">
  import { invalidate } from '$app/navigation';
  import AppSidebar from '$lib/components/app-sidebar.svelte';
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import { onMount } from 'svelte';
  import '../app.css';

  let { data, children } = $props();
  let { supabase, session, user } = $derived(data);

  onMount(() => {
    const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
      if (newSession?.expires_at !== session?.expires_at) {
        invalidate('supabase:auth');
      }
    });

    return () => data.subscription.unsubscribe();
  });
</script>

<Sidebar.Provider>
  {#if user}
    <AppSidebar />
  {/if}
  <div class="w-full">
    <div class="flex items-center justify-between bg-muted p-4">
      <div class="flex items-center gap-4">
        {#if user}
          <Sidebar.Trigger class="flex-none" />
        {/if}
        <a href="/" class="shrink">App</a>
      </div>
      <div class="flex items-center gap-4">
        {#if user}
          <form action="/login?/logout" method="POST">
            <button class="hover:cursor-pointer">ログアウト</button>
          </form>
        {:else}
          <a href="/login" class="flex justify-end">ログイン</a>
        {/if}
      </div>
    </div>
    <div class="mx-auto max-w-3xl space-y-4 p-4">
      {@render children()}
    </div>
  </div>
</Sidebar.Provider>
