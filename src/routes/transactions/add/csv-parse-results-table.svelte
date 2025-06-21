<script lang="ts">
  import * as Table from '$lib/components/ui/table/index.js';
  import { CircleCheck, TriangleAlert } from '@lucide/svelte';
  import type { Transaction } from '../schema';

  type CsvParseResult = {
    valid: boolean;
    raw: string;
    data?: Transaction;
    messages?: string[];
  };

  let { results = [] }: { results?: CsvParseResult[] } = $props();
</script>

<Table.Root>
  <Table.Header>
    <Table.Row>
      <Table.Head>行</Table.Head>
      <Table.Head>CSV</Table.Head>
      <Table.Head>検証結果</Table.Head>
      <Table.Head>エラー詳細</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each results as result, index}
      <Table.Row>
        <Table.Cell>{index + 1}</Table.Cell>
        <Table.Cell class="whitespace-break-spaces">{result.raw}</Table.Cell>
        <Table.Cell>
          {#if result.valid}
            <CircleCheck size={16} style="color: hsl(140, 100%, 27%)" />
          {:else}
            <TriangleAlert size={16} class="text-destructive" />
          {/if}
        </Table.Cell>
        <Table.Cell class="whitespace-break-spaces">
          {#if !result.valid}
            <ul class="text-destructive text-sm">
              {#each result.messages ?? [] as message}
                <li>{message}</li>
              {/each}
            </ul>
          {/if}
        </Table.Cell>
      </Table.Row>
    {/each}
  </Table.Body>
</Table.Root>
