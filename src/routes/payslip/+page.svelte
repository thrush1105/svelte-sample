<script lang="ts">
  import { updateUrlQuery } from '$lib';
  import MonthSelect from '$lib/components/month-select.svelte';
  import Payslip from '$lib/components/payslip.svelte';
  import Button from '$lib/components/ui/button/button.svelte';
  import { Download } from '@lucide/svelte';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  let params = $state({
    month: data.month
  });

  let csvDownloadLink = $derived(`/payslip/download?contentType=csv&month=${params.month}`);
  let jsonDownloadLink = $derived(`/payslip/download?contentType=json&month=${params.month}`);
</script>

<Button variant="link" href="/payslip/yearly">年間</Button>

<MonthSelect
  bind:value={params.month}
  onValueChange={() => {
    updateUrlQuery({
      month: params.month
    });
  }}
/>

{#each data.payslipList as p}
  <Payslip data={p} />
{/each}

{#if data.count > 0}
  <Button variant="outline" href={csvDownloadLink} target="_blank">
    <Download />
    CSVダウンロード
  </Button>
  <Button variant="outline" href={jsonDownloadLink} target="_blank">
    <Download />
    JSONダウンロード
  </Button>
{/if}
