<script lang="ts">
  import Separator from '$lib/components/ui/separator/separator.svelte';
  import type { PageProps } from './$types';
  import OauthSignupForm from './oauth-signup-form.svelte';
  import SignupForm from './signup-form.svelte';

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>アカウント作成</title>
</svelte:head>

<p class="text-3xl font-bold">アカウント作成</p>

<SignupForm {data} />

<Separator />

<OauthSignupForm />
