<script lang="ts">
  import type { PageProps } from './$types.js';
  import LoginForm from './login-form.svelte';

  let { data }: PageProps = $props();
</script>

<LoginForm {data} />
