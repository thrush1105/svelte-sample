<script lang="ts">
  import Separator from '$lib/components/separator.svelte';
  import type { PageProps } from './$types';
  import LoginForm from './login-form.svelte';
  import OauthLoginForm from './oauth-login-form.svelte';

  let { data }: PageProps = $props();
</script>

<LoginForm {data} />

<Separator text="または" />

<OauthLoginForm />

<p class="text-center">
  アカウントをお持ちでない方は<a href="/signup" class="underline">アカウントを作成</a>
</p>
