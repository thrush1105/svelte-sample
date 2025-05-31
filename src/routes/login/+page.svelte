<script lang="ts">
  import Separator from '$lib/components/ui/separator/separator.svelte';
  import type { PageProps } from './$types';
  import LoginForm from './login-form.svelte';
  import OauthLoginForm from './oauth-login-form.svelte';

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>ログイン</title>
</svelte:head>

<p class="text-3xl font-bold">ログイン</p>

<LoginForm {data} />

<Separator />

<OauthLoginForm />
