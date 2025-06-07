<script lang="ts">
  import * as Avatar from '$lib/components/ui/avatar/index.js';
  import { LogOut, User } from '@lucide/svelte';
  import AppAvatarDropdownMenu from './app-avatar-dropdown-menu.svelte';
  import LogoutDialog from './logout-dialog.svelte';
  import type { User as SupabaseUser } from '@supabase/supabase-js';

  type Props = {
    user?: SupabaseUser | null;
  };

  let { user }: Props = $props();

  let isLogoutDialogOpen = $state(false);

  const menu = [
    {
      label: 'ログアウト',
      icon: LogOut,
      execute: () => {
        isLogoutDialogOpen = true;
      }
    }
  ];
</script>

<AppAvatarDropdownMenu {user} {menu}>
  <Avatar.Root>
    <Avatar.Image src={user?.user_metadata.avatar_url} alt="@shadcn" />
    <Avatar.Fallback>
      <User />
    </Avatar.Fallback>
  </Avatar.Root>
</AppAvatarDropdownMenu>

<LogoutDialog bind:open={isLogoutDialogOpen} />
