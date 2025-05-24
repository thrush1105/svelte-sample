<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import Loading from '$lib/components/loading.svelte';
  import SearchInput from '$lib/components/search-input.svelte';
  import { buttonVariants } from '$lib/components/ui/button/button.svelte';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import { Skeleton } from '$lib/components/ui/skeleton/index.js';
  import { cn, updateUrlQuery } from '$lib/utils.js';
  import { ArrowDownUp } from '@lucide/svelte';
  import type { PageProps } from './$types.js';
  import AddFormDialog from './add-form-dialog.svelte';
  import { deleteVideo } from './api.js';
  import ErrorDialog from './error-dialog.svelte';
  import VideoView from './video-view.svelte';

  let { data }: PageProps = $props();

  let searchText = $state(data.params.data.q);

  let dialog = $state({
    open: false,
    message: ''
  });

  let isLoading = $state(false);

  /**
   * 検索ボックスの値が変更されたときの処理。
   * URLのクエリパラメータを更新する。
   */
  const handleSearch = async () => {
    if (searchText) {
      updateUrlQuery({ q: searchText });
    } else {
      updateUrlQuery({ q: null });
    }
  };

  const handleSort = async (sort: string) => {
    updateUrlQuery({ sort: sort });
  };

  /**
   * 削除ボタンを押したときの処理。
   * データを再取得する。
   */
  const handleDelete = async (id: number) => {
    if (!confirm('本当に削除しますか？')) {
      return;
    }

    isLoading = true;

    const { error: errorOnDelete } = await deleteVideo(data.supabase, id);

    isLoading = false;

    if (errorOnDelete) {
      dialog.open = true;
      dialog.message = errorOnDelete.message;
    } else {
      invalidateAll();
    }
  };
</script>

<svelte:head>
  <title>YouTube</title>
</svelte:head>

<div class="space-y-4">
  <div class="flex gap-4">
    <AddFormDialog {data} />
    {@render sortMenu()}
  </div>

  <SearchInput
    bind:value={searchText}
    onkeydown={(e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    }}
  />

  <div class="grid gap-4 sm:grid-cols-2">
    {#await data.videos}
      {#each Array(6) as _}
        <Skeleton class="h-80 rounded-lg" />
      {/each}
    {:then res}
      {#each res.data ?? [] as video}
        <VideoView data={video} onDelete={handleDelete} />
      {/each}
    {/await}
  </div>
</div>

<Loading loading={isLoading} />

<ErrorDialog bind:open={dialog.open} message={dialog.message} />

{#snippet sortMenu()}
  <DropdownMenu.Root>
    <DropdownMenu.Trigger
      class={cn(buttonVariants({ variant: 'outline', size: 'icon' }), 'rounded-full')}
    >
      <ArrowDownUp size={20} />
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
      <DropdownMenu.Group>
        <DropdownMenu.Item onclick={() => handleSort('-created_at')}>
          追加日が新しい順
        </DropdownMenu.Item>
        <DropdownMenu.Item onclick={() => handleSort('created_at')}>
          追加日が古い順
        </DropdownMenu.Item>
        <DropdownMenu.Item onclick={() => handleSort('-published_at')}>
          公開日が新しい順
        </DropdownMenu.Item>
        <DropdownMenu.Item onclick={() => handleSort('published_at')}>
          公開日が古い順
        </DropdownMenu.Item>
        <DropdownMenu.Item onclick={() => handleSort('-view_count')}>
          再生回数が多い順
        </DropdownMenu.Item>
        <DropdownMenu.Item onclick={() => handleSort('view_count')}>
          再生回数が少ない順
        </DropdownMenu.Item>
      </DropdownMenu.Group>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
{/snippet}
