<script lang="ts">
  import Separator from '$lib/components/separator.svelte';
  import type { Transaction } from '../schema';
  import CreateForm from './add-form.svelte';
  import ImportCsvForm from './import-csv-form.svelte';

  let transactions = $state<Transaction[]>([]);
</script>

<p class="text-2xl font-medium">CSVインポート</p>

<ImportCsvForm bind:data={transactions} />

<Separator />

<p class="text-2xl font-medium">取引明細</p>

<CreateForm bind:data={transactions} />
