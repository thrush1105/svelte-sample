<script lang="ts">
  import { buttonVariants } from '$lib/components/ui/button/index.js';
  import { cn } from '$lib/utils';

  let { data } = $props();
  let { user } = $derived(data);
</script>

<svelte:head>
  <title>ホーム</title>
</svelte:head>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

{#if user}
  <a href="/dashboard" class={cn(buttonVariants())}> ダッシュボード </a>
{/if}
