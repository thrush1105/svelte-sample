<script lang="ts">
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import { useSidebar } from '$lib/components/ui/sidebar/index.js';
  import { FileText, LayoutDashboard, Link2, MessageCircleQuestion, Youtube } from '@lucide/svelte';

  const sidebar = useSidebar();

  const items = [
    {
      title: 'ダッシュボード',
      url: '/dashboard',
      icon: LayoutDashboard
    },
    {
      title: '外部サービス連携',
      url: '/oauth',
      icon: Link2
    },
    {
      title: 'YouTube',
      url: '/youtube',
      icon: Youtube
    },
    {
      title: '給与明細',
      url: '/payslip/monthly',
      icon: FileText
    },
    {
      title: 'クイズ',
      url: '/quiz',
      icon: MessageCircleQuestion
    }
  ];
</script>

<Sidebar.Root>
  <Sidebar.Content>
    <Sidebar.Group>
      <Sidebar.GroupLabel>App</Sidebar.GroupLabel>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          {#each items as item (item.title)}
            <Sidebar.MenuItem>
              <Sidebar.MenuButton
                onclick={() => {
                  sidebar.setOpenMobile(false);
                }}
              >
                {#snippet child({ props })}
                  <a href={item.url} {...props}>
                    <item.icon />
                    <span>{item.title}</span>
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
