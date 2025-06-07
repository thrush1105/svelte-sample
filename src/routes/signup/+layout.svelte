<script lang="ts">
  let { children } = $props();
</script>

<svelte:head>
  <title>アカウント登録</title>
</svelte:head>

<div class="mx-auto max-w-sm space-y-4">
  <p class="text-3xl font-bold">アカウント登録</p>
  {@render children()}
</div>
