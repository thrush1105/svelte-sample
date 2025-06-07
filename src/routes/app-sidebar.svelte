<script lang="ts">
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import { useSidebar } from '$lib/components/ui/sidebar/index.js';
  import { Home } from '@lucide/svelte';

  const sidebar = useSidebar();

  const menus = [
    {
      title: 'Home',
      url: '/',
      icon: Home
    }
  ];
</script>

<Sidebar.Root>
  <Sidebar.Content>
    <Sidebar.Group>
      <Sidebar.GroupLabel>App</Sidebar.GroupLabel>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          {#each menus as menu (menu.title)}
            <Sidebar.MenuItem>
              <Sidebar.MenuButton
                onclick={() => {
                  sidebar.setOpenMobile(false);
                }}
              >
                {#snippet child({ props })}
                  <a href={menu.url} {...props}>
                    <menu.icon />
                    <span>{menu.title}</span>
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
