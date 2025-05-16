<script lang="ts">
  import Button from '$lib/components/ui/button/button.svelte';
  import YearlyPayslip from '$lib/components/yearly-payslip.svelte';
  import { Download } from '@lucide/svelte';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<Button variant="link" href="/payslip">月別</Button>

<YearlyPayslip items={data.yearlyPayslipList} />

{#if data.count > 0}
  <Button variant="outline" href="/payslip/yearly/download?contentType=csv" target="_blank">
    <Download />
    CSVダウンロード
  </Button>

  <Button variant="outline" href="/payslip/yearly/download?contentType=json" target="_blank">
    <Download />
    JSONダウンロード
  </Button>
{/if}
