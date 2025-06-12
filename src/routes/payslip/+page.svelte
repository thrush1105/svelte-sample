<script lang="ts">
  import MonthSelect from '$lib/components/month-select.svelte';
  import { updateUrlQuery } from '$lib/url';
  import type { PageProps } from './$types';
  import Payslip from './payslip.svelte';

  let { data }: PageProps = $props();
  let params = $state(data.params);
</script>

<svelte:head>
  <title>給与明細</title>
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
  {#each data.payslipList as payslip}
    <Payslip {payslip} />
  {/each}
</div>
