<script lang="ts">
  import Button from '$lib/components/ui/button/button.svelte';
  import type { PageProps } from './$types';
  import UpdatePasswordForm from './update-password-form.svelte';

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>パスワード変更</title>
</svelte:head>

<p class="text-3xl font-bold">パスワード変更</p>

<UpdatePasswordForm {data} />

<Button variant="secondary" class="w-full" onclick={() => history.back()}>戻る</Button>
