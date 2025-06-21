<script lang="ts">
  import Separator from '$lib/components/separator.svelte';
  import type { Transaction } from '../schema';
  import CreateForm from './add-form.svelte';
  import ImportCsvForm from './import-csv-form.svelte';

  let transactions = $state<Transaction[]>([]);
</script>

<ImportCsvForm bind:data={transactions} />

<Separator />

<CreateForm bind:data={transactions} />
