<script lang="ts">
  import { Search, X } from '@lucide/svelte';
  import Input from './ui/input/input.svelte';

  type Props = {
    value?: string;
    placeholder?: string;
    onEnter?: () => void;
    onReset?: () => void;
  };

  let {
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
    class="w-full pl-10"
    onkeydown={(e: KeyboardEvent) => {
      if (e.key === 'Enter') onEnter?.();
    }}
    {...restProps}
  />

  <button
    type="button"
    class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60"
    tabindex="-1"
  >
    <Search size={20} />
  </button>

  {#if value}
    <button
      type="button"
      class="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground/60 hover:bg-muted"
      onclick={() => {
        value = '';
        onReset?.();
      }}
    >
      <X size={20} />
    </button>
  {/if}
</div>
