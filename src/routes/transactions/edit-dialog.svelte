<script lang="ts">
  import Button from '$lib/components/ui/button/button.svelte';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import { Edit } from '@lucide/svelte';
  import type { Tables } from '../../database.types';
  import EditForm from './edit-form.svelte';

  let { data, open = $bindable(false) }: { data: Tables<'transactions'>; open?: boolean } =
    $props();

  const closeDialog = () => (open = false);
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="ghost" size="icon" class="rounded-full">
        <Edit />
      </Button>
    {/snippet}
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>編集</Dialog.Title>
      <Dialog.Description>取引明細を編集します。(ID: {data.id})</Dialog.Description>
    </Dialog.Header>
    <EditForm {data} onSuccess={closeDialog} onCancel={closeDialog} />
  </Dialog.Content>
</Dialog.Root>
