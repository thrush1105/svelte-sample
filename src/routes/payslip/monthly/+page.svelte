<script lang="ts">
  import { updateUrlQuery } from '$lib';
  import MonthSelect from '$lib/components/month-select.svelte';
  import Payslip from '$lib/components/payslip.svelte';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  let params = $state({
    month: data.month
  });
</script>

<svelte:head>
  <title>給与明細 - 月別</title>
</svelte:head>

<MonthSelect
  bind:value={params.month}
  onValueChange={() => {
    updateUrlQuery({
      month: params.month
    });
  }}
/>

<div class="space-y-4">
  {#each data.payslipList as p}
    <Payslip data={p} />
  {/each}
</div>
