<script lang="ts">
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import { Ellipsis, Trash2 } from '@lucide/svelte';
  import { type VideoRow } from './type';

  type Props = {
    data: VideoRow;
    onDelete?: (id: number) => void;
  };

  let { data, onDelete }: Props = $props();

  let url = $derived(`https://www.youtube.com/watch?v=${data.video_id}`);
  let channelUrl = $derived(`https://www.youtube.com/channel/${data.channel_id}`);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };

  const formatViewCount = (views: number | null) => {
    return views === null ? '' : `${views.toLocaleString()} views`;
  };

  const handleDelete = () => {
    onDelete?.(data.id);
  };
</script>

<div>
  <a href={url} target="_blank" rel="noopener noreferrer">
    <img src={data.thumbnail} alt={data.title} class="w-full rounded-lg hover:opacity-80" />
  </a>
  <div class="mt-2 flex items-start justify-between">
    <div class="flex w-full flex-col">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        class="text-lg font-bold hover:underline"
      >
        {data.title}
      </a>
      <div class="flex justify-between">
        <a href={channelUrl} target="_blank" rel="noopener noreferrer" class="hover:underline">
          {data.channel_title}
        </a>
        {@render menu()}
      </div>
      <div class="text-sm text-muted-foreground">
        <p>{formatViewCount(data.view_count)}</p>
        <p>Published at {formatDate(data.published_at)}</p>
        <p>Saved at {formatDate(data.created_at)}</p>
      </div>
    </div>
  </div>
</div>

{#snippet menu()}
  <DropdownMenu.Root>
    <DropdownMenu.Trigger class="h-fit rounded-full p-1 hover:bg-muted">
      <Ellipsis size={20} />
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
      <DropdownMenu.Group>
        <DropdownMenu.Item onclick={handleDelete}>
          <Trash2 />
          削除
        </DropdownMenu.Item>
      </DropdownMenu.Group>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
{/snippet}
