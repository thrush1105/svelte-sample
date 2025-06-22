<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import type { Tables } from '../../database.types';
  import DeletePayslipForm from './delete-payslip-form.svelte';

  type Props = {
    open?: boolean;
    payslip: Tables<'payslips'>;
    onDelete?: () => void;
  };

  let { open = $bindable(false), payslip, onDelete }: Props = $props();
</script>

<Dialog.Root bind:open>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>削除</Dialog.Title>
      <Dialog.Description>給与明細を削除します。(ID: {payslip.id})</Dialog.Description>
    </Dialog.Header>
    <DeletePayslipForm
      id={payslip.id}
      onUpdate={() => {
        open = false;
        onDelete?.();
      }}
      onCancel={() => (open = false)}
    />
  </Dialog.Content>
</Dialog.Root>
