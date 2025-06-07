<script lang="ts">
  let { children } = $props();
</script>

<svelte:head>
  <title>ログイン</title>
</svelte:head>

<div class="mx-auto max-w-sm space-y-4">
  <p class="text-3xl font-bold">ログイン</p>
  {@render children()}
</div>
