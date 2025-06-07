<script lang="ts">
  import { Separator } from '$lib/components/ui/separator';

  type Props = {
    text?: string | null;
  };

  let { text }: Props = $props();
</script>

{#if text}
  <div
    class="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t"
  >
    <span class="bg-card text-muted-foreground relative z-10 px-2">{text}</span>
  </div>
{:else}
  <Separator />
{/if}
