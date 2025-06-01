<script lang="ts">
  import { buttonVariants } from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import { cn } from '$lib/utils';
  import { RotateCw } from '@lucide/svelte';
  import UpdateForm from './update-form.svelte';

  type Props = {
    open?: boolean;
    onUpdated?: () => void;
  };

  let { open = $bindable(false), onUpdated }: Props = $props();
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger class={cn(buttonVariants({ variant: 'outline' }))}>
    <RotateCw />
    更新
  </Dialog.Trigger>
  <Dialog.Content interactOutsideBehavior="close">
    <Dialog.Header>
      <Dialog.Title>動画情報を更新する</Dialog.Title>
      <Dialog.Description>動画情報を更新します。</Dialog.Description>
    </Dialog.Header>
    <UpdateForm
      onUpdated={() => {
        open = false;
        onUpdated?.();
      }}
    />
  </Dialog.Content>
</Dialog.Root>
