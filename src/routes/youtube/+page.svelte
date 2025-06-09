<script lang="ts">
  import ErrorAlert from '$lib/components/error-alert.svelte';
  import SearchInput from '$lib/components/search-input.svelte';
  import SelectBox from '$lib/components/select-box.svelte';
  import Button from '$lib/components/ui/button/button.svelte';
  import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
  import { updateUrlQuery } from '$lib/url';
  import { RotateCw } from '@lucide/svelte';
  import { InfiniteLoader, LoaderState } from 'svelte-infinite';
  import type { Tables } from '../../database.types';
  import type { PageProps } from './$types';
  import AddVideoDialog from './add-video-dialog.svelte';
  import VideoView from './video-view.svelte';

  const loaderState = new LoaderState();
  const perPage = 20;

  let { data }: PageProps = $props();
  let { q, sort } = $state(data.params);

  let videos: Tables<'youtube_videos'>[] = $state([]);
  let pageNumber = $state(1);
  let errorMessage: string | null = $state(null);

  const loadVideos = async () => {
    const from = perPage * (pageNumber - 1);
    const to = from + perPage - 1;

    let query = data.supabase.from('youtube_videos').select().range(from, to);

    if (q) {
      query.or(`title.ilike.%${q}%,channel_title.ilike.%${q}%,description.ilike.%${q}%`);
    }

    if (sort) {
      const field = sort.startsWith('-') ? sort.slice(1) : sort;
      const ascending = !sort.startsWith('-');
      query.order(field, { ascending });
    }

    const { data: _videos, error: errorOnSelect } = await query;

    if (errorOnSelect) {
      console.error(errorOnSelect);
      errorMessage = `エラーが発生しました: ${errorOnSelect.code}`;
      loaderState.error();
      return;
    } else {
      errorMessage = null;
    }

    videos = [...videos, ..._videos];

    if (videos.length >= data.total) {
      loaderState.complete();
    } else {
      loaderState.loaded();
      pageNumber++;
    }
  };

  const reload = async () => {
    videos = [];
    pageNumber = 1;

    if (loaderState.status === 'COMPLETE') {
      loaderState.reset();
      loadVideos();
    }
  };

  const searchVideos = async () => {
    updateUrlQuery({ q: q || null });
    reload();
  };

  const sortVideos = async () => {
    updateUrlQuery({ sort: sort || null });
    reload();
  };

  const deleteVideo = async (id: number) => {
    videos = videos.filter((v) => v.id !== id);
  };
</script>

<div class="flex flex-col-reverse justify-between gap-4 sm:flex-row">
  <div class="flex gap-4">
    <AddVideoDialog data={data.addForm} onUpdate={reload} />
    <SelectBox
      options={[
        { label: '追加日が新しい順', value: '-created_at' },
        { label: '追加日が古い順', value: 'created_at' },
        { label: '公開日が新しい順', value: '-published_at' },
        { label: '公開日が古い順', value: 'published_at' },
        { label: '再生回数が多い順', value: '-view_count' },
        { label: '再生回数が少ない順', value: 'view_count' }
      ]}
      bind:value={sort}
      onSelect={sortVideos}
    />
  </div>
  <SearchInput class="w-full sm:w-sm" bind:value={q} onEnter={searchVideos} onReset={reload} />
</div>

<InfiniteLoader {loaderState} triggerLoad={loadVideos} loopMaxCalls={5}>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {#each videos as video (video.id)}
      <VideoView {video} onDelete={deleteVideo} />
    {/each}
  </div>

  {#snippet loading()}
    <div class="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {#each Array(12) as _}
        <Skeleton class="h-80 w-full rounded-lg" />
      {/each}
    </div>
  {/snippet}

  {#snippet noData()}
    <!--  -->
  {/snippet}

  {#snippet error(load)}
    <div class="w-full">
      <div class="max-w-sm space-y-4">
        <ErrorAlert title="読み込みエラー" message={errorMessage} />
        <Button onclick={load}>
          <RotateCw />
          再読み込み
        </Button>
      </div>
    </div>
  {/snippet}
</InfiniteLoader>
