<script lang="ts">
  import * as Table from '$lib/components/ui/table/index.js';
  import type { YearlyPayslip } from '$lib/types/payslip';

  let { items }: { items: YearlyPayslip[] } = $props();
</script>

<Table.Root>
  <Table.Header>
    <Table.Row>
      <Table.Head>年</Table.Head>
      <Table.Head>基本給</Table.Head>
      <Table.Head>残業手当</Table.Head>
      <Table.Head>総支給額</Table.Head>
      <Table.Head>健康保険</Table.Head>
      <Table.Head>厚生年金</Table.Head>
      <Table.Head>雇用保険</Table.Head>
      <Table.Head>所得税</Table.Head>
      <Table.Head>住民税</Table.Head>
      <Table.Head>控除合計</Table.Head>
      <Table.Head>差引支給額</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each items as p}
      <Table.Row>
        <Table.Cell>{p.year}</Table.Cell>
        <Table.Cell>{p.basic_salary.toLocaleString()}</Table.Cell>
        <Table.Cell>{p.overtime_allowance.toLocaleString()}</Table.Cell>
        <Table.Cell>{p.total_earnings.toLocaleString()}</Table.Cell>
        <Table.Cell>{p.health_insurance.toLocaleString()}</Table.Cell>
        <Table.Cell>{p.employees_pension.toLocaleString()}</Table.Cell>
        <Table.Cell>{p.employment_insurance.toLocaleString()}</Table.Cell>
        <Table.Cell>{p.income_tax.toLocaleString()}</Table.Cell>
        <Table.Cell>{p.resident_tax.toLocaleString()}</Table.Cell>
        <Table.Cell>{p.total_deductions.toLocaleString()}</Table.Cell>
        <Table.Cell>{p.net_pay.toLocaleString()}</Table.Cell>
      </Table.Row>
    {/each}
  </Table.Body>
</Table.Root>
