<script lang="ts">
  import { buttonVariants } from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import { cn } from '$lib/utils';
  import { type Infer, type SuperValidated } from 'sveltekit-superforms';
  import AddForm from './add-form.svelte';
  import { type FormSchema } from './schema';
  import { Plus } from '@lucide/svelte';

  type Props = {
    open?: boolean;
    data: { form: SuperValidated<Infer<FormSchema>> };
    onUpdated?: () => void;
  };

  let { open = $bindable(false), data, onUpdated }: Props = $props();
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger class={cn(buttonVariants({ variant: 'outline' }))}>
    <Plus />
    追加
  </Dialog.Trigger>
  <Dialog.Content interactOutsideBehavior="close">
    <Dialog.Header>
      <Dialog.Title>動画を追加する</Dialog.Title>
      <Dialog.Description>YouTubeのURLを入力してください。</Dialog.Description>
    </Dialog.Header>
    <AddForm
      {data}
      onUpdated={() => {
        open = false;
        onUpdated?.();
      }}
    />
  </Dialog.Content>
</Dialog.Root>
