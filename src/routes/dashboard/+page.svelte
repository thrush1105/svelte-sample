<script lang="ts">
  import Button from '$lib/components/ui/button/button.svelte';
  import { Label } from '$lib/components/ui/label/index.js';

  let { data } = $props();
  let { user } = $derived(data);
</script>

<svelte:head>
  <title>ダッシュボード</title>
</svelte:head>

<p class="text-3xl font-bold">ダッシュボード</p>

{#if user}
  <div>
    <Label>ユーザーID</Label>
    <p class="text-muted-foreground">{user.id}</p>
  </div>
  <div>
    <Label>メールアドレス</Label>
    <p class="text-muted-foreground">{user.email}</p>
  </div>
  <div>
    <Label>パスワード</Label>
    <br />
    <Button variant="outline" href="/update-password">パスワード変更</Button>
  </div>
{/if}
