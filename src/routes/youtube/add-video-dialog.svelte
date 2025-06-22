<script lang="ts">
  import { buttonVariants } from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import { cn } from '$lib/utils';
  import { Plus } from '@lucide/svelte';
  import { type Infer, type SuperValidated } from 'sveltekit-superforms';
  import AddVideoForm from './add-video-form.svelte';
  import { type AddVideoFormSchema } from './schema';

  type Props = {
    open?: boolean;
    data: SuperValidated<Infer<AddVideoFormSchema>>;
    onUpdate?: () => void;
  };

  let { open = $bindable(false), data, onUpdate }: Props = $props();
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger class={cn(buttonVariants({ variant: 'outline' }))}>
    <Plus />
    追加
  </Dialog.Trigger>
  <Dialog.Content interactOutsideBehavior="close">
    <Dialog.Header>
      <Dialog.Title>追加</Dialog.Title>
      <Dialog.Description>YouTubeのURLを入力してください。</Dialog.Description>
    </Dialog.Header>
    <AddVideoForm
      {data}
      onUpdate={() => {
        open = false;
        onUpdate?.();
      }}
      onCancel={() => (open = false)}
    />
  </Dialog.Content>
</Dialog.Root>
