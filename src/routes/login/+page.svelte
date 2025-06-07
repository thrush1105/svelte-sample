<script lang="ts">
  import Separator from '$lib/components/ui/separator/separator.svelte';
  import type { PageProps } from './$types.js';
  import LoginForm from './login-form.svelte';
  import OauthLoginForm from './oauth-login-form.svelte';

  let { data }: PageProps = $props();
</script>

<LoginForm {data} />

<Separator />

<OauthLoginForm />
