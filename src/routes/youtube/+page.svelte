<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import Loading from '$lib/components/loading.svelte';
  import MyDropdownMenu from '$lib/components/my-dropdown-menu.svelte';
  import SearchInput from '$lib/components/search-input.svelte';
  import * as Alert from '$lib/components/ui/alert/index.js';
  import Button from '$lib/components/ui/button/button.svelte';
  import { Skeleton } from '$lib/components/ui/skeleton/index.js';
  import type { YoutubeVideo } from '$lib/models/YoutubeVideo.js';
  import { updateUrlQuery } from '$lib/utils.js';
  import { CircleAlertIcon, RotateCw } from '@lucide/svelte';
  import { InfiniteLoader, LoaderState } from 'svelte-infinite';
  import type { Infer } from 'sveltekit-superforms';
  import type { PageProps } from './$types.js';
  import AddFormDialog from './add-form-dialog.svelte';
  import { countVideos, deleteVideo, selectVideos } from './api.js';
  import ErrorDialog from './error-dialog.svelte';
  import type { ParamsSchema } from './schema.js';
  import VideoView from './video-view.svelte';
  import UpdateFormDialog from './update-form-dialog.svelte';

  const loaderState = new LoaderState();

  const sortOptions = [
    { label: '追加日が新しい順', value: '-created_at' },
    { label: '追加日が古い順', value: 'created_at' },
    { label: '公開日が新しい順', value: '-published_at' },
    { label: '公開日が古い順', value: 'published_at' },
    { label: '再生回数が多い順', value: '-view_count' },
    { label: '再生回数が少ない順', value: 'view_count' }
  ];

  let { data }: PageProps = $props();

  let items = $state<YoutubeVideo['Row'][]>([]);
  let search = $state<Infer<ParamsSchema>>(data.params);
  let pageNumber = $state(1);
  let maxPageNumber = $state(0);
  let isLoading = $state(false);
  let dialog = $state({
    open: false,
    message: ''
  });
  let errorMessage = $state('');

  const loadMore = async () => {
    if (pageNumber === 1) {
      const { count } = await countVideos(data.supabase, search, data.user?.id);
      maxPageNumber = Math.ceil((count ?? 0) / 20);
    }

    const { data: videos, error: errorOnSelect } = await selectVideos(
      data.supabase,
      search,
      data.user?.id,
      pageNumber
    );

    if (errorOnSelect) {
      console.error(errorOnSelect);
      errorMessage = errorOnSelect.message;
      loaderState.error();
      return;
    }

    items.push(...videos);

    if (pageNumber >= maxPageNumber) {
      loaderState.complete();
    } else {
      loaderState.loaded();
      pageNumber++;
    }

    errorMessage = '';
  };

  /**
   * 再読み込みする。
   */
  const reload = async () => {
    items = [];
    pageNumber = 1;

    if (loaderState.status === 'COMPLETE') {
      loaderState.reset();
      loadMore();
    }
  };

  /**
   * 検索ボックスの値が変更されたときの処理。
   * URLのクエリパラメータを更新する。
   */
  const handleSearch = async () => {
    updateUrlQuery({ q: search.q || null });
    reload();
  };

  /**
   * ソートが選択されたときの処理。
   * URLのクエリパラメータを更新する。
   */
  const handleSort = async () => {
    updateUrlQuery({ sort: search.sort || null });
    reload();
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
      console.error(errorOnDelete);
      dialog.open = true;
      dialog.message = errorOnDelete.message;
      return;
    }

    items = items.filter((i) => i.id !== id);
  };
</script>

<svelte:head>
  <title>YouTube</title>
</svelte:head>

<div class="space-y-4">
  <SearchInput bind:value={search.q} onEnter={handleSearch} onReset={reload} />

  <div class="flex gap-4">
    <AddFormDialog {data} onUpdated={reload} />
    <MyDropdownMenu options={sortOptions} bind:value={search.sort} onSelect={handleSort} />
    <UpdateFormDialog />
  </div>

  <InfiniteLoader {loaderState} triggerLoad={loadMore} loopMaxCalls={5}>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {#each items as video}
        <VideoView data={video} onDelete={handleDelete} />
      {/each}
    </div>

    {#snippet loading()}
      <div class="w-full space-y-4">
        {#each Array(6) as _}
          <Skeleton class="h-80 rounded-lg" />
        {/each}
      </div>
    {/snippet}

    {#snippet noData()}
      <!--  -->
    {/snippet}

    {#snippet error(load)}
      <div class="w-full space-y-4">
        <Alert.Root variant="destructive">
          <CircleAlertIcon class="size-4" />
          <Alert.Title>読み込みエラー</Alert.Title>
          <Alert.Description>{errorMessage}</Alert.Description>
        </Alert.Root>
        <Button onclick={load}>
          <RotateCw />
          再読み込み
        </Button>
      </div>
    {/snippet}
  </InfiniteLoader>
</div>

<Loading loading={isLoading} />

<ErrorDialog bind:open={dialog.open} message={dialog.message} />
