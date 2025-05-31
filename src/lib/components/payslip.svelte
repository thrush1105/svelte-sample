<script lang="ts">
  import { enhance } from '$app/forms';
  import Button from '$lib/components/ui/button/button.svelte';
  import type { Payslip } from '$lib/types/payslip';
  import { Download, Pencil, Trash2 } from '@lucide/svelte';

  let { data }: { data: Payslip } = $props();
</script>

<div class="mx-auto space-y-4 rounded-lg border p-4 shadow sm:w-full">
  <div class="flex justify-between">
    <div>
      <p class="text-xl font-semibold">{data.type}</p>
      <p class="font-medium">{data.date}</p>
    </div>
    <div class="flex gap-4">
      {@render editButton()}
      {@render deleteButton()}
    </div>
  </div>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-12">
    <div class="space-y-2">
      <p class="text-center text-lg font-semibold">支給</p>
      {#each data.earnings.items as i}
        {@render row(i)}
      {/each}
      {@render row(data.earnings.total)}
    </div>
    <div class="space-y-2">
      <p class="text-center text-lg font-semibold">控除</p>
      {#each data.deductions.items as i}
        {@render row(i)}
      {/each}
      {@render row(data.deductions.total)}
    </div>
    <div class="space-y-2">
      <p class="text-center text-lg font-semibold">差引支給額</p>
      {#each data.netPay.items as i}
        {@render row(i)}
      {/each}
    </div>
  </div>
  <div class="flex gap-4">
    {@render csvDownloadButton()}
    {@render jsonDownloadButton()}
  </div>
</div>

{#snippet editButton()}
  <Button variant="outline" href={`/payslip/update?id=${data.id}`}>
    <Pencil />
    編集
  </Button>
{/snippet}

{#snippet deleteButton()}
  <form
    method="POST"
    action="?/delete"
    use:enhance={({ cancel }) => {
      if (!confirm('削除しますか？')) {
        cancel();
      }
    }}
  >
    <input type="hidden" name="id" value={data.id} />
    <Button variant="outline" type="submit">
      <Trash2 />
      削除
    </Button>
  </form>
{/snippet}

{#snippet csvDownloadButton()}
  <Button variant="outline" href={`/payslip/download?format=csv&id=${data.id}`} target="_blank">
    <Download />
    CSV
  </Button>
{/snippet}

{#snippet jsonDownloadButton()}
  <Button variant="outline" href={`/payslip/download?format=json&id=${data.id}`} target="_blank">
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
