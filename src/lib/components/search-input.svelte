<script lang="ts">
  import { Search } from '@lucide/svelte';
  import Input from './ui/input/input.svelte';

  let { value = $bindable(), placeholder = '検索', ...restProps } = $props();
</script>

<div class="relative">
  <Input bind:value type="text" {placeholder} required class="w-full pl-10" {...restProps} />
  <button
    type="button"
    class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60"
    tabindex="-1"
  >
    <Search size={20} />
  </button>
</div>
