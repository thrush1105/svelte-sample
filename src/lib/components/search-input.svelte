<script lang="ts">
  import { cn } from '$lib/utils';
  import { Search, X } from '@lucide/svelte';
  import Input from './ui/input/input.svelte';

  type Props = {
    class?: string;
    value?: string;
    placeholder?: string;
    onEnter?: () => void;
    onReset?: () => void;
  };

  let {
    class: className,
    value = $bindable(),
    placeholder = '検索',
    onEnter,
    onReset,
    ...restProps
  }: Props = $props();
</script>

<div class="relative">
  <Input
    bind:value
    type="text"
    {placeholder}
    class={cn('pl-10', className)}
    onkeydown={(e: KeyboardEvent) => {
      if (e.key === 'Enter') onEnter?.();
    }}
    {...restProps}
  />

  <button
    type="button"
    class="text-muted-foreground/60 absolute top-1/2 left-4 -translate-y-1/2"
    tabindex="-1"
  >
    <Search size={20} />
  </button>

  {#if value}
    <button
      type="button"
      class="text-muted-foreground/60 hover:bg-muted absolute top-1/2 right-4 -translate-y-1/2 rounded-full p-1"
      onclick={() => {
        value = '';
        onReset?.();
      }}
    >
      <X size={20} />
    </button>
  {/if}
</div>
