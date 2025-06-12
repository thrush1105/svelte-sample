<script lang="ts">
  import * as Table from '$lib/components/ui/table/index.js';
  import type { Database } from '../../../database.types';

  let { items }: { items: Database['public']['Functions']['get_yearly_payslip']['Returns'] } =
    $props();
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
    {#each items as item}
      <Table.Row>
        <Table.Cell>{item.year}</Table.Cell>
        <Table.Cell>{item.basic_salary.toLocaleString()}</Table.Cell>
        <Table.Cell>{item.overtime_allowance.toLocaleString()}</Table.Cell>
        <Table.Cell>{item.total_earnings.toLocaleString()}</Table.Cell>
        <Table.Cell>{item.health_insurance.toLocaleString()}</Table.Cell>
        <Table.Cell>{item.employees_pension.toLocaleString()}</Table.Cell>
        <Table.Cell>{item.employment_insurance.toLocaleString()}</Table.Cell>
        <Table.Cell>{item.income_tax.toLocaleString()}</Table.Cell>
        <Table.Cell>{item.resident_tax.toLocaleString()}</Table.Cell>
        <Table.Cell>{item.total_deductions.toLocaleString()}</Table.Cell>
        <Table.Cell>{item.net_pay.toLocaleString()}</Table.Cell>
      </Table.Row>
    {/each}
  </Table.Body>
</Table.Root>
