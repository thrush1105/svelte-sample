<script lang="ts">
  import { Input } from '$lib/components/ui/input/index.js';
  import { Label } from '$lib/components/ui/label/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import type { PageProps } from './$types';
  import { Github } from '@lucide/svelte';
  import Separator from '$lib/components/ui/separator/separator.svelte';

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
      <Input
        bind:value={password}
        type="password"
        name="password"
        placeholder="パスワード"
        required
      />
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
