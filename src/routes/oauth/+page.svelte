<script lang="ts">
  import Button from '$lib/components/ui/button/button.svelte';
  import Label from '$lib/components/ui/label/label.svelte';

  let { data } = $props();
</script>

<svelte:head>
  <title>外部サービス連携</title>
</svelte:head>

<p class="text-3xl font-bold">外部サービス連携</p>

<p class="text-2xl font-bold">Google</p>

<div class="space-y-4">
  <div class="flex gap-4">
    {#if data.google}
      <Button href="/oauth/google">再認証</Button>
      <form method="POST" action="?/revoke">
        <input type="hidden" name="provider" value="google">
        <Button variant="destructive" type="submit">連携解除</Button>
      </form>
    {:else}
      <Button href="/oauth/google">連携</Button>
    {/if}
  </div>

  {#if data.google}
    <div class="space-y-4 break-all">
      <div>
        <Label>スコープ</Label>
        <p class="text-muted-foreground">{data.google.scope}</p>
      </div>
      <div>
        <Label>アクセストークン</Label>
        <p class="text-muted-foreground">{data.google.access_token}</p>
      </div>
      <div>
        <Label>リフレッシュトークン</Label>
        <p class="text-muted-foreground">{data.google.refresh_token}</p>
      </div>
      <div>
        <Label>有効期限</Label>
        <p class="text-muted-foreground">
          {data.google.expiry_date && new Date(data.google.expiry_date).toLocaleString()}
        </p>
      </div>
    </div>
  {/if}

  <Button variant="outline" href="/oauth/google/api" target="_blank">API実行</Button>
</div>
