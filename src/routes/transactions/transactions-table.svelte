<script lang="ts">
  import * as Table from '$lib/components/ui/table/index.js';
  import { cn } from '$lib/utils';
  import type { Tables } from '../../database.types';
  import DeleteDialog from './delete-dialog.svelte';
  import EditDialog from './edit-dialog.svelte';

  let { data: transactions }: { data: Tables<'transactions'>[] } = $props();
</script>

<Table.Root>
  <Table.Header>
    <Table.Row>
      <Table.Head>取引日</Table.Head>
      <Table.Head>サービス名</Table.Head>
      <Table.Head>カテゴリー</Table.Head>
      <Table.Head>取引内容</Table.Head>
      <Table.Head>金額</Table.Head>
      <Table.Head></Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each transactions as transaction (transaction)}
      <Table.Row>
        <Table.Cell>{transaction.date}</Table.Cell>
        <Table.Cell>{transaction.service}</Table.Cell>
        <Table.Cell>{transaction.category}</Table.Cell>
        <Table.Cell>{transaction.description}</Table.Cell>
        <Table.Cell class={cn(transaction.amount && transaction.amount < 0 && 'text-destructive')}>
          {transaction.amount?.toLocaleString()}
        </Table.Cell>
        <Table.Cell>
          <EditDialog data={transaction} />
          <DeleteDialog data={transaction} />
        </Table.Cell>
      </Table.Row>
    {/each}
  </Table.Body>
</Table.Root>
