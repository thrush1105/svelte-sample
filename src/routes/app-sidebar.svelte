<script lang="ts">
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import { useSidebar } from '$lib/components/ui/sidebar/index.js';
  import { getMenu } from '$lib/menu';
  import type { User as SupabaseUser } from '@supabase/supabase-js';

  const sidebar = useSidebar();

  type Props = {
    user?: SupabaseUser | null;
  };

  let { user }: Props = $props();

  let menu = $derived(getMenu(!!user));
</script>

<Sidebar.Root>
  <Sidebar.Content>
    <Sidebar.Group>
      <Sidebar.GroupLabel>App</Sidebar.GroupLabel>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          {#each menu as m (m.title)}
            <Sidebar.MenuItem>
              <Sidebar.MenuButton
                onclick={() => {
                  sidebar.setOpenMobile(false);
                }}
              >
                {#snippet child({ props })}
                  <a href={m.url} {...props}>
                    <m.icon />
                    <span>{m.title}</span>
                  </a>
                {/snippet}
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          {/each}
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  </Sidebar.Content>
</Sidebar.Root>
