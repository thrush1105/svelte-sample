<script lang="ts">
  import Button from '$lib/components/ui/button/button.svelte';
  import { Download, Pencil, Trash2 } from '@lucide/svelte';
  import DeletePayslipDialog from './delete-payslip-dialog.svelte';

  let { payslip } = $props();

  let isDeleteDialogOpen = $state(false);
</script>

<div class="mx-auto space-y-4 rounded-lg border p-4 shadow sm:w-full">
  <div class="flex justify-between">
    <div>
      <p class="text-xl font-semibold">{payslip.type}</p>
      <p class="font-medium">{payslip.date}</p>
    </div>
    <div class="flex gap-4">
      {@render editButton()}
      {@render deleteButton()}
    </div>
  </div>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-12">
    <div class="space-y-2">
      <p class="text-center text-lg font-semibold">支給</p>
      {#each payslip.earnings.items as i}
        {@render row(i)}
      {/each}
      {@render row(payslip.earnings.total)}
    </div>
    <div class="space-y-2">
      <p class="text-center text-lg font-semibold">控除</p>
      {#each payslip.deductions.items as i}
        {@render row(i)}
      {/each}
      {@render row(payslip.deductions.total)}
    </div>
    <div class="space-y-2">
      <p class="text-center text-lg font-semibold">差引支給額</p>
      {#each payslip.netPay.items as i}
        {@render row(i)}
      {/each}
    </div>
  </div>
  <div class="flex gap-4">
    {@render csvDownloadButton()}
    {@render jsonDownloadButton()}
  </div>
</div>

<DeletePayslipDialog bind:open={isDeleteDialogOpen} {payslip} />

{#snippet editButton()}
  <Button variant="outline" href={`/payslip/edit?id=${payslip.id}`}>
    <Pencil />
    編集
  </Button>
{/snippet}

{#snippet deleteButton()}
  <Button variant="outline" onclick={() => (isDeleteDialogOpen = true)}>
    <Trash2 />
    削除
  </Button>
{/snippet}

{#snippet csvDownloadButton()}
  <Button variant="outline" href={`/payslip/download?format=csv&id=${payslip.id}`} target="_blank">
    <Download />
    CSV
  </Button>
{/snippet}

{#snippet jsonDownloadButton()}
  <Button variant="outline" href={`/payslip/download?format=json&id=${payslip.id}`} target="_blank">
    <Download />
    JSON
  </Button>
{/snippet}

{#snippet row(item: { label: string; value: number })}
  <div class="grid grid-cols-2 items-end border-b">
    <div>{item.label}</div>
    <div class="text-right">{item.value.toLocaleString()}</div>
  </div>
{/snippet}
