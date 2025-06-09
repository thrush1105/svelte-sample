<script lang="ts">
  import { buttonVariants } from '$lib/components/ui/button';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import { cn } from '$lib/utils';
  import { Ellipsis, type IconProps } from '@lucide/svelte';
  import type { Component } from 'svelte';

  type MenuItem = {
    label: string;
    icon?: Component<IconProps, {}, ''>;
    variant?: string;
    execute?: () => void;
  };

  type Props = {
    menu?: MenuItem[];
  };

  let { menu = [] }: Props = $props();
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger
    class={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'rounded-full ')}
  >
    <Ellipsis size={12} />
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Group>
      {#each menu as m}
        <DropdownMenu.Item variant={m.variant as any} onclick={m.execute}>
          <m.icon></m.icon>
          {m.label}
        </DropdownMenu.Item>
      {/each}
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>
