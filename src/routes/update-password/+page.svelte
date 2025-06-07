<script lang="ts">
  import Button from '$lib/components/ui/button/button.svelte';
  import type { PageProps } from './$types';
  import UpdatePasswordForm from './update-password-form.svelte';

  let { data }: PageProps = $props();
</script>

<UpdatePasswordForm {data} />

<Button variant="secondary" class="w-full" href="/profile">戻る</Button>
