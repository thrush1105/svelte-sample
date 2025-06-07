<script lang="ts">
  import { Check, Copy } from '@lucide/svelte';

  type Props = {
    text?: string;
    class?: string;
    size?: number;
  };

  let { text, class: className, size = 16 }: Props = $props();

  let copied = $state(false);

  const copyText = async () => {
    if (!navigator.clipboard || !text || copied) return;
    await navigator.clipboard.writeText(text);
    copied = true;
    setTimeout(() => {
      copied = false;
    }, 1000);
  };
</script>

<button class={className} onclick={copyText}>
  {#if copied}
    <Check {size} />
  {:else}
    <Copy {size} />
  {/if}
</button>
