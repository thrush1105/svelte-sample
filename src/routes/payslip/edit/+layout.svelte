<script lang="ts">
  let { children } = $props();
</script>

<svelte:head>
  <title>給与明細を編集</title>
</svelte:head>

<div class="mx-auto max-w-sm space-y-4">
  <p class="text-3xl font-bold">給与明細を編集</p>
  {@render children()}
</div>
