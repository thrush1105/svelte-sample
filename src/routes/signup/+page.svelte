<script lang="ts">
  import Separator from '$lib/components/separator.svelte';
  import type { PageProps } from './$types';
  import OauthSignupForm from './oauth-signup-form.svelte';
  import SignupForm from './signup-form.svelte';

  let { data }: PageProps = $props();
</script>

<SignupForm {data} />

<Separator text="または" />

<OauthSignupForm />

<p class="text-center">
  アカウントをお持ちの方は<a href="/login" class="underline">ログイン</a>
</p>
