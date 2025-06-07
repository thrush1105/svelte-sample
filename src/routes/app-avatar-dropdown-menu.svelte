<script lang="ts">
  import { buttonVariants } from '$lib/components/ui/button';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import { cn } from '$lib/utils';
  import { type IconProps } from '@lucide/svelte';
  import type { User } from '@supabase/supabase-js';
  import type { Component, Snippet } from 'svelte';

  type MenuItem = {
    label: string;
    icon?: Component<IconProps, {}, ''>;
    variant?: string;
    execute?: () => void;
  };

  type Props = {
    menu?: MenuItem[];
    user?: User | null;
    children?: Snippet;
  };

  let { menu = [], user, children }: Props = $props();
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger
    class={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'rounded-full ')}
  >
    {@render children?.()}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Group>
      <DropdownMenu.Label>{user?.email}</DropdownMenu.Label>
      <DropdownMenu.Separator />
      {#each menu as m}
        <DropdownMenu.Item variant={m.variant as any} onclick={m.execute}>
          <m.icon></m.icon>
          {m.label}
        </DropdownMenu.Item>
      {/each}
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>
