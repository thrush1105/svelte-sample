<script lang="ts">
  import Button from '$lib/components/ui/button/button.svelte';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import { Trash2 } from '@lucide/svelte';
  import type { Tables } from '../../database.types';
  import DeleteForm from './delete-form.svelte';

  let { data, open = $bindable(false) }: { data: Tables<'transactions'>; open?: boolean } =
    $props();

  const closeDialog = () => (open = false);
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger>
    {#snippet child({ props })}
      <Button
        {...props}
        variant="ghost"
        size="icon"
        class="hover:bg-destructive/10 focus-visible:ring-destructive/20 text-destructive hover:text-destructive rounded-full"
      >
        <Trash2 />
      </Button>
    {/snippet}
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>削除</Dialog.Title>
      <Dialog.Description>取引明細を削除します。(ID: {data.id})</Dialog.Description>
    </Dialog.Header>
    <DeleteForm {data} onSuccess={closeDialog} onCancel={closeDialog} />
  </Dialog.Content>
</Dialog.Root>
