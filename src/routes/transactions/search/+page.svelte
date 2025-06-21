<script lang="ts">
  import StatisticsView from '../statistics-view.svelte';
  import TransactionsTable from '../transactions-table.svelte';
  import type { PageProps } from './$types';
  import SearchForm from './search-form.svelte';

  let { data }: PageProps = $props();

  let params = $state(data.params);
</script>

<SearchForm bind:params categories={data.categories} />

<StatisticsView data={data.statistics} />

<TransactionsTable data={data.transactions} />
