<script lang="ts">
  import type { Payslip } from '$lib/types/payslip';

  let { data }: { data: Payslip } = $props();
</script>

<div class="mx-auto w-64 space-y-2 rounded-lg border p-4 sm:w-full">
  <p class="text-xl">{data.type}</p>
  <p>{data.date}</p>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-12">
    <div class="space-y-2">
      <p class="text-center text-lg">支給</p>
      {#each data.earnings.items as i}
        {@render row(i)}
      {/each}
      {@render row(data.earnings.total)}
    </div>
    <div class="space-y-2">
      <p class="text-center text-lg">控除</p>
      {#each data.deductions.items as i}
        {@render row(i)}
      {/each}
      {@render row(data.deductions.total)}
    </div>
    <div class="space-y-2">
      <p class="text-center text-lg">差引支給額</p>
      {#each data.netPay.items as i}
        {@render row(i)}
      {/each}
    </div>
  </div>
</div>

{#snippet row(item: { label: string; value: number })}
  <div class="grid grid-cols-2 items-end border-b">
    <div>{item.label}</div>
    <div class="text-right">{item.value.toLocaleString()}</div>
  </div>
{/snippet}
