<script lang="ts">
  import { afterNavigate, beforeNavigate, invalidate } from '$app/navigation';
  import AppSidebar from '$lib/components/app-sidebar.svelte';
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import NProgress from 'nprogress';
  import 'nprogress/nprogress.css';
  import { onMount } from 'svelte';
  import '../app.css';

  NProgress.configure({ showSpinner: false });

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

  beforeNavigate(({ from, to }) => {
    NProgress.start();
  });

  afterNavigate(({ from, to }) => {
    NProgress.done();
  });
</script>

<Sidebar.Provider>
  {#if user}
    <AppSidebar />
  {/if}
  <div class="w-full">
    {@render header()}
    <div class="mx-auto max-w-7xl space-y-4 p-4">
      {@render children()}
    </div>
  </div>
</Sidebar.Provider>

{#snippet header()}
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
        <a href="/signup" class="flex justify-end">新規登録</a>
      {/if}
    </div>
  </div>
{/snippet}
