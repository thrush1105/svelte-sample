<script lang="ts">
  import Button from '$lib/components/ui/button/button.svelte';
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import type { User } from '@supabase/supabase-js';
  import AppAvatar from './app-avatar.svelte';

  type Props = {
    user?: User | null;
  };

  let { user }: Props = $props();
</script>

<div class="flex items-center justify-between p-4">
  <div class="flex items-center gap-4">
    <Sidebar.Trigger />
    <a href="/" class="font-bold">App</a>
  </div>
  <div class="flex items-center gap-4">
    {#if user}
      <AppAvatar {user} />
    {:else}
      <div class="flex gap-4">
        <Button variant="outline" href="/login">ログイン</Button>
        <Button variant="default" href="/signup">新規登録</Button>
      </div>
    {/if}
  </div>
</div>
