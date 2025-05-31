<script lang="ts">
  import Button from '$lib/components/ui/button/button.svelte';
  import YearlyPayslip from '../yearly-payslip.svelte';
  import { Download } from '@lucide/svelte';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>給与明細 - 年別</title>
</svelte:head>

<YearlyPayslip items={data.payslipList} />

{#if data.count > 0}
  <div class="flex gap-4">
    {@render csvDownloadButton()}
    {@render jsonDownloadButton()}
  </div>
{/if}

{#snippet csvDownloadButton()}
  <Button variant="outline" href={`/payslip/yearly/download?format=csv`} target="_blank">
    <Download />
    CSV
  </Button>
{/snippet}

{#snippet jsonDownloadButton()}
  <Button variant="outline" href={`/payslip/yearly/download?format=json`} target="_blank">
    <Download />
    JSON
  </Button>
{/snippet}
