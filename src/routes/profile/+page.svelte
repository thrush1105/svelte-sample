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
    <Label>名前</Label>
    <div class="text-muted-foreground flex items-center gap-2">
      {user.user_metadata.name ?? '-'}
    </div>
  </div>
  <div class="space-y-2">
    <Label>パスワード</Label>
    <a href="/update-password" class="text-muted-foreground hover:underline">
      パスワードを変更する
    </a>
  </div>
  <div class="space-y-2">
    <Label>最終ログイン日時</Label>
    <div class="text-muted-foreground flex items-center gap-2">
      {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : '-'}
    </div>
  </div>
{/if}
