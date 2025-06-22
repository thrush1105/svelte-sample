<script lang="ts">
  let { children } = $props();
</script>

<svelte:head>
  <title>取引明細を追加</title>
</svelte:head>

<p class="text-3xl font-bold">取引明細を追加</p>

{@render children()}
