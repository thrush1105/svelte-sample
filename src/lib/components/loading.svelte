<script lang="ts">
  import { LoaderCircle } from '@lucide/svelte';
  import { fade } from 'svelte/transition';

  let { loading }: { loading: boolean } = $props();
</script>

{#if loading}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" transition:fade>
    <LoaderCircle class="animate-spin text-white/50" size={48} />
  </div>
{/if}
