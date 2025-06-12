<script lang="ts">
  import Button from '$lib/components/ui/button/button.svelte';
  import Input from '$lib/components/ui/input/input.svelte';
  import { getNextMonth, getPreviousMonth } from '$lib/date';
  import { ChevronLeft, ChevronRight } from '@lucide/svelte';

  type Props = {
    value?: string;
    onValueChange?: (value: string) => void;
  };

  let { value = $bindable(''), onValueChange }: Props = $props();
</script>

<div class="flex justify-center gap-4">
  <Button
    variant="outline"
    size="icon"
    class="rounded-full"
    onclick={() => {
      value = getPreviousMonth(value);
      onValueChange?.(value);
    }}
  >
    <ChevronLeft />
  </Button>

  <Input
    type="month"
    class="w-fit"
    bind:value
    oninput={() => {
      onValueChange?.(value);
    }}
  />

  <Button
    variant="outline"
    size="icon"
    class="rounded-full"
    onclick={() => {
      value = getNextMonth(value);
      onValueChange?.(value);
    }}
  >
    <ChevronRight />
  </Button>
</div>
