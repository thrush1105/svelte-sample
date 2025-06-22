<script lang="ts">
  import MonthSelect from '$lib/components/month-select.svelte';
  import Button from '$lib/components/ui/button/button.svelte';
  import { updateUrlQuery } from '$lib/url';
  import { Plus, Search } from '@lucide/svelte';
  import type { PageProps } from './$types';
  import StatisticsView from './statistics-view.svelte';
  import TransactionsTable from './transactions-table.svelte';

  let { data }: PageProps = $props();

  let params = $state(data.params);
</script>

<svelte:head>
  <title>取引明細</title>
</svelte:head>

<div class="flex items-center gap-4">
  <Button variant="outline" href="/transactions/add">
    <Plus />
    追加
  </Button>
  <Button variant="outline" href="/transactions/search">
    <Search />
    検索
  </Button>
</div>

<MonthSelect
  bind:value={params.month}
  onValueChange={() => {
    updateUrlQuery({ month: params.month });
  }}
/>

<StatisticsView data={data.statistics} />

<TransactionsTable data={data.transactions} />
