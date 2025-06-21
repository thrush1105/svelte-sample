<script lang="ts">
  import { Button } from '$lib/components/ui/button/index.js';
  import * as Command from '$lib/components/ui/command/index.js';
  import * as Popover from '$lib/components/ui/popover/index.js';
  import { cn } from '$lib/utils.js';
  import Check from '@lucide/svelte/icons/check';
  import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down';
  import { tick } from 'svelte';

  type Props = {
    options?: { label: string; value: string }[];
    value?: string;
    noSelect?: string;
    placeholder?: string;
    noResult?: string;
    onSelect?: (value: string) => void;
  };

  let {
    options = [],
    value = $bindable(''),
    noSelect,
    placeholder,
    noResult = 'No results found',
    onSelect
  }: Props = $props();

  let open = $state(false);
  let triggerRef = $state<HTMLButtonElement>(null!);

  const selectedValue = $derived(options.find((f) => f.value === value)?.label);

  // We want to refocus the trigger button when the user selects
  // an item from the list so users can continue navigating the
  // rest of the form with the keyboard.
  function closeAndFocusTrigger() {
    open = false;
    tick().then(() => {
      triggerRef.focus();
    });
  }
</script>

<Popover.Root bind:open>
  <Popover.Trigger bind:ref={triggerRef}>
    {#snippet child({ props })}
      <Button variant="outline" {...props} role="combobox" aria-expanded={open}>
        {selectedValue || noSelect}
        <ChevronsUpDown class="opacity-50" />
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="w-auto p-0">
    <Command.Root>
      <Command.Input {placeholder} />
      <Command.List>
        <Command.Empty>{noResult}</Command.Empty>
        <Command.Group value="options">
          {#each options as options (options.value)}
            <Command.Item
              class="py-2 hover:cursor-pointer"
              value={options.label}
              onSelect={() => {
                if (value !== options.value) {
                  value = options.value;
                } else {
                  value = '';
                }
                closeAndFocusTrigger();
                onSelect?.(value);
              }}
            >
              <Check class={cn(value !== options.value && 'text-transparent')} />
              {options.label}
            </Command.Item>
          {/each}
        </Command.Group>
      </Command.List>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
