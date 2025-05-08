<script lang="ts">
  import { invalidate } from '$app/navigation';
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

<header>
  <nav class="flex justify-between bg-muted p-4">
    <div>
      <a href="/" class="hover:">Home</a>
    </div>
    <div>
      {#if user}
        <form action="/login?/logout" method="POST">
          <button class="hover:cursor-pointer">ログアウト</button>
        </form>
      {:else}
        <a href="/login">ログイン</a>
      {/if}
    </div>
  </nav>
</header>

<main class="mx-auto max-w-xl space-y-4 p-4">
  {@render children()}
</main>
