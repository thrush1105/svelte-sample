<script lang="ts">
  import { buttonVariants } from '$lib/components/ui/button';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import { cn } from '$lib/utils';
  import { Check, ChevronDown } from '@lucide/svelte';

  type Props = {
    options?: { label: string; value: string }[];
    value?: string;
    open?: boolean;
    placeholder?: string;
    onSelect?: (value: string) => void;
  };

  let {
    options,
    value: selectedValue = $bindable(),
    open = $bindable(false),
    placeholder,
    onSelect
  }: Props = $props();

  const selectedLabel = $derived(options?.find((f) => f.value === selectedValue)?.label);

  const selectMenu = (value: string) => {
    selectedValue = value;
    onSelect?.(selectedValue);
  };
</script>

<DropdownMenu.Root bind:open>
  <DropdownMenu.Trigger class={cn(buttonVariants({ variant: 'outline' }))}>
    <ChevronDown />
    {selectedLabel ?? placeholder}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Group>
      {#each options ?? [] as opt}
        {@render menuItem(opt.label, opt.value)}
      {/each}
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>

{#snippet menuItem(label: string, value: string)}
  <DropdownMenu.Item class="py-2.5 hover:cursor-pointer" onclick={() => selectMenu(value)}>
    <Check class={cn(value !== selectedValue && 'text-transparent')} />
    {label}
  </DropdownMenu.Item>
{/snippet}
