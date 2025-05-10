<script lang="ts">
  import PasswordInput from '$lib/components/password-input.svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Label } from '$lib/components/ui/label/index.js';
  import Separator from '$lib/components/ui/separator/separator.svelte';
  import { Github } from '@lucide/svelte';
  import type { PageProps } from './$types';

  let { form }: PageProps = $props();

  let email = $state(form?.email ?? '');
  let password = $state('');
</script>

<svelte:head>
  <title>ログイン</title>
</svelte:head>

<p class="text-2xl font-bold">ログイン</p>
{#if form?.error}
  <p class="text-destructive">{form.error.message}</p>
{/if}
<form method="POST" action="?/login">
  <div class="space-y-4">
    <div>
      <Label>メールアドレス</Label>
      <Input bind:value={email} type="email" name="email" placeholder="メールアドレス" required />
    </div>
    <div>
      <Label>パスワード</Label>
      <PasswordInput bind:value={password} name="password" placeholder="パスワード" />
    </div>
    <Button type="submit" class="w-full">ログイン</Button>
  </div>
</form>

<Separator />

<form method="POST" action="?/loginWithOAuth">
  <input type="hidden" name="provider" value="github" />
  <Button type="submit" variant="outline" class="w-full">
    <Github />
    GitHubでログイン
  </Button>
</form>
