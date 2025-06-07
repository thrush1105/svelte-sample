<script lang="ts">
  import { invalidate } from '$app/navigation';
  import { page } from '$app/state';
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import { Toaster } from '$lib/components/ui/sonner/index.js';
  import { onMount } from 'svelte';
  import { toast } from 'svelte-sonner';
  import { getFlash } from 'sveltekit-flash-message';
  import '../app.css';
  import AppHeader from './app-header.svelte';
  import AppSidebar from './app-sidebar.svelte';

  let { data, children } = $props();
  let { session, supabase, user } = $derived(data);

  const flash = getFlash(page);

  onMount(() => {
    const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
      if (newSession?.expires_at !== session?.expires_at) {
        invalidate('supabase:auth');
      }
    });
    return () => data.subscription.unsubscribe();
  });

  $effect(() => {
    if (!$flash) return;
    if ($flash.type === 'success') {
      toast.success($flash.message, { position: 'bottom-right', richColors: true });
    } else if ($flash.type === 'error') {
      toast.error($flash.message, { position: 'bottom-right', richColors: true });
    }
  });
</script>

<Sidebar.Provider>
  <AppSidebar {user} />
  <main class="w-full">
    <AppHeader {user} />
    <div class="mx-auto max-w-7xl p-4">
      {@render children()}
    </div>
  </main>
</Sidebar.Provider>

<Toaster />
