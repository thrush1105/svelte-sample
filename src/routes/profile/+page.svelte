<script lang="ts">
  import CopyButton from '$lib/components/copy-button.svelte';
  import Label from '$lib/components/ui/label/label.svelte';

  let { data } = $props();
  let { user } = $derived(data);
</script>

{#if user}
  <div class="space-y-2">
    <Label>ユーザーID</Label>
    <div class="text-muted-foreground flex items-center gap-2">
      {user.id}
      <CopyButton class="hover:text-foreground" text={user.id} />
    </div>
  </div>
  <div class="space-y-2">
    <Label>メールアドレス</Label>
    <div class="text-muted-foreground flex items-center gap-2">
      {user.email}
      <CopyButton class="hover:text-foreground" text={user.email} />
    </div>
  </div>
  <div class="space-y-2">
    <Label>パスワード</Label>
    <a href="/update-password" class="text-muted-foreground hover:underline">
      パスワードを変更する
    </a>
  </div>
{/if}
