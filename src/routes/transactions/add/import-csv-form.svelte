<script lang="ts">
  import ErrorAlert from '$lib/components/error-alert.svelte';
  import Button from '$lib/components/ui/button/button.svelte';
  import Input from '$lib/components/ui/input/input.svelte';
  import { Import } from '@lucide/svelte';
  import { toast } from 'svelte-sonner';
  import { csvSchema, type Transaction } from '../schema';
  import CsvParseResultsTable from './csv-parse-results-table.svelte';
  import HelpDialog from './help-dialog.svelte';

  type CsvParseResult = {
    valid: boolean;
    raw: string;
    data?: Transaction;
    messages?: string[];
  };

  let { data: transactions = $bindable([]) }: { data?: Transaction[] } = $props();

  let files = $state<FileList>();
  let fileInputRef = $state<HTMLInputElement | null>(null);
  let csvParseResults = $state<CsvParseResult[]>([]);
  let isCsvValid = $derived(csvParseResults.every((r) => r.valid));

  const parseCsv = () => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target?.result as string;
      const isBinary = /[\x00-\x08\x0E-\x1F]/.test(content);

      if (isBinary) {
        toast.error('ファイル形式が不正です', { position: 'bottom-right', richColors: true });
        return;
      }

      csvParseResults = [];

      for (const line of content.split(/\r\n|\r|\n/)) {
        if (!line.trim()) {
          csvParseResults.push({
            valid: true,
            raw: line
          });
          continue;
        }

        const values = line.trim().split(',');

        if (values.length !== 6) {
          csvParseResults.push({
            valid: false,
            raw: line,
            messages: ['カラム数が正しくありません']
          });
          continue;
        }

        const result = csvSchema.safeParse(values);

        if (result.success) {
          csvParseResults.push({
            valid: true,
            raw: line,
            data: result.data
          });
        } else {
          csvParseResults.push({
            valid: false,
            raw: line,
            messages: result.error.issues.map((i) => i.message)
          });
        }
      }
    };

    reader.readAsText(file);
  };

  const importCsv = () => {
    transactions = [
      ...transactions,
      ...csvParseResults.filter((r) => r.valid && !!r.data).map((r) => r.data as Transaction)
    ];
    if (fileInputRef) fileInputRef.value = '';
    csvParseResults = [];
  };

  $effect(() => {
    if (files && files.length > 0) {
      parseCsv();
    }
  });
</script>

<div class="flex items-center gap-2">
  <Input type="file" bind:files bind:ref={fileInputRef} class="w-auto" />
  <HelpDialog />
</div>

{#if csvParseResults.length > 0}
  {#if !isCsvValid}
    <ErrorAlert title="CSV読み込みエラー" message="CSVの内容に誤りがあります" />
  {/if}

  <CsvParseResultsTable results={csvParseResults} />

  {#if isCsvValid}
    <Button variant="outline" onclick={importCsv}>
      <Import />
      取り込む
    </Button>
  {/if}
{/if}
