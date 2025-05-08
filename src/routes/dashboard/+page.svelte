<script lang="ts">
  import { Label } from '$lib/components/ui/label/index.js';

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
{/if}
