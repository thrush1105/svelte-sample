<script lang="ts">
  import PasswordInput from '$lib/components/password-input.svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Label } from '$lib/components/ui/label/index.js';
  import type { PageProps } from './$types';

  let { form }: PageProps = $props();

  let currentPassword = $state('');
  let newPassword = $state('');
  let confirmNewPassword = $state('');
</script>

<svelte:head>
  <title>パスワード変更</title>
</svelte:head>

<p class="text-2xl font-bold">パスワード変更</p>
{#if form?.error}
  <p class="text-destructive">{form.error.message}</p>
{/if}
<form method="POST" action="?/updatePassword">
  <div class="space-y-4">
    <div>
      <Label>現在のパスワード</Label>
      <PasswordInput
        bind:value={currentPassword}
        name="currentPassword"
        placeholder="現在のパスワード"
      />
    </div>
    <div>
      <Label>新しいパスワード</Label>
      <PasswordInput bind:value={newPassword} name="newPassword" placeholder="新しいパスワード" />
    </div>
    <div>
      <Label>新しいパスワード（確認）</Label>
      <PasswordInput
        bind:value={confirmNewPassword}
        name="confirmNewPassword"
        placeholder="新しいパスワード（確認）"
      />
    </div>
    <Button type="submit" class="w-full">変更する</Button>
  </div>
</form>
