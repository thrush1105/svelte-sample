<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import type { Tables } from '../../database.types';
  import DeleteVideoForm from './delete-video-form.svelte';

  type Props = {
    open?: boolean;
    video: Tables<'youtube_videos'>;
    onDelete?: () => void;
  };

  let { open = $bindable(false), video, onDelete }: Props = $props();
</script>

<Dialog.Root bind:open>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>動画を削除しますか？</Dialog.Title>
      <Dialog.Description>{video.title}</Dialog.Description>
    </Dialog.Header>
    <DeleteVideoForm
      id={video.id}
      onUpdate={() => {
        open = false;
        onDelete?.();
      }}
      onCancel={() => (open = false)}
    />
  </Dialog.Content>
</Dialog.Root>
