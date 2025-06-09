<script lang="ts">
  import { deserialize } from '$app/forms';
  import { goto } from '$app/navigation';
  import ActionMenu from '$lib/components/action-menu.svelte';
  import { RotateCw, Trash2 } from '@lucide/svelte';
  import { toast } from 'svelte-sonner';
  import type { Tables } from '../../database.types';
  import DeleteVideoDialog from './delete-video-dialog.svelte';

  type Props = {
    video: Tables<'youtube_videos'>;
    onDelete?: (id: number) => void;
  };

  let { video, onDelete }: Props = $props();

  const updateVideo = async () => {
    const data = new FormData();

    data.set('videoId', String(video.video_id));

    const response = await fetch('?/update', {
      method: 'POST',
      body: data
    });

    const result = deserialize(await response.text());

    if (result.type === 'success') {
      video = result.data?.video as Tables<'youtube_videos'>;
      toast.success('動画を更新しました', {
        position: 'bottom-right',
        richColors: true
      });
    } else if (result.type === 'failure') {
      toast.error('エラーが発生しました', {
        position: 'bottom-right',
        richColors: true
      });
    } else if (result.type === 'error') {
      toast.error(result.error?.message as string, {
        position: 'bottom-right',
        richColors: true
      });
    } else if (result.type === 'redirect') {
      goto(result.location);
    }
  };

  const menu = [
    {
      label: '更新',
      icon: RotateCw,
      variant: 'default',
      execute: updateVideo
    },
    {
      label: '削除',
      icon: Trash2,
      variant: 'destructive',
      execute: () => {
        isDeleteDialogOpen = true;
      }
    }
  ];

  let isDeleteDialogOpen = $state(false);

  let url = $derived(`https://www.youtube.com/watch?v=${video.video_id}`);
  let channelUrl = $derived(`https://www.youtube.com/channel/${video.channel_id}`);

  const formatDate = (date: string | null) => {
    return date ? new Date(date).toLocaleString() : '';
  };

  const formatViewCount = (count: number | null) => {
    return count ? `${count.toLocaleString()} views` : '';
  };
</script>

<div class="space-y-2">
  <a href={url} target="_blank" rel="noopener noreferrer" class="block">
    <img src={video.thumbnail} alt={video.title} class="w-full rounded-md hover:opacity-80" />
  </a>
  <div class="flex w-full flex-col">
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      class="text-lg font-bold hover:underline"
    >
      {video.title}
    </a>
    <div class="flex items-center justify-between">
      <a href={channelUrl} target="_blank" rel="noopener noreferrer" class="hover:underline">
        {video.channel_title}
      </a>
      <ActionMenu {menu} />
    </div>
    <div class="text-muted-foreground text-sm">
      <p>{formatViewCount(video.view_count)}</p>
      <p>Published at {formatDate(video.published_at)}</p>
      <p>Saved at {formatDate(video.created_at)}</p>
    </div>
  </div>
</div>

<DeleteVideoDialog
  bind:open={isDeleteDialogOpen}
  {video}
  onDelete={() => {
    onDelete?.(video.id);
  }}
/>
