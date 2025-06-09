<script lang="ts">
  let { children } = $props();
</script>

<svelte:head>
  <title>YouTube</title>
</svelte:head>

<div class="mx-auto max-w-7xl space-y-4">
  {@render children()}
</div>
