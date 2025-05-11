<script lang="ts">
  import { buttonVariants } from '$lib/components/ui/button/button.svelte';
  import { Label } from '$lib/components/ui/label/index.js';
  import { cn } from '$lib/utils';

  let { data } = $props();
  let { user } = $derived(data);
</script>

<svelte:head>
  <title>ダッシュボード</title>
</svelte:head>

<p class="text-2xl font-bold">ダッシュボード</p>

{#if user}
  <div>
    <Label>ID</Label>
    <p class="text-muted-foreground">{user.id}</p>
  </div>
  <div>
    <Label>メールアドレス</Label>
    <p class="text-muted-foreground">{user.email}</p>
  </div>
  <div>
    <Label>パスワード</Label>
    <br />
    <a href="/update-password" class={cn(buttonVariants({ variant: 'outline' }))}>
      パスワード変更
    </a>
  </div>
{/if}
