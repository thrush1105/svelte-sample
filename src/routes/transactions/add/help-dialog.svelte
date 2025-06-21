<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import Label from '$lib/components/ui/label/label.svelte';
  import * as Table from '$lib/components/ui/table/index.js';
  import { HelpCircle } from '@lucide/svelte';
</script>

<Dialog.Root>
  <Dialog.Trigger>
    <HelpCircle size={16} class="text-muted-foreground" />
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>CSV仕様</Dialog.Title>
      <Dialog.Description></Dialog.Description>
      <div class="space-y-4">
        <div>
          <Label>ファイル形式</Label>
          <p class="text-muted-foreground">CSV</p>
        </div>
        <div>
          <Label>文字コード</Label>
          <p class="text-muted-foreground">UTF-8</p>
        </div>
        <div>
          <Label>ヘッダー行</Label>
          <p class="text-muted-foreground">なし</p>
        </div>
        <div>
          <Label>データ定義</Label>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.Head>列</Table.Head>
                <Table.Head>項目</Table.Head>
                <Table.Head>データ型</Table.Head>
                <Table.Head>例</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>1</Table.Cell>
                <Table.Cell>サービス名</Table.Cell>
                <Table.Cell>string</Table.Cell>
                <Table.Cell>ABC銀行</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>2</Table.Cell>
                <Table.Cell>取引日</Table.Cell>
                <Table.Cell>date (yyyy-MM-dd)</Table.Cell>
                <Table.Cell>2025-06-21</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>3</Table.Cell>
                <Table.Cell>金額</Table.Cell>
                <Table.Cell>integer</Table.Cell>
                <Table.Cell>-123456</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>5</Table.Cell>
                <Table.Cell>カテゴリー</Table.Cell>
                <Table.Cell>string</Table.Cell>
                <Table.Cell>日用品</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>5</Table.Cell>
                <Table.Cell>取引内容</Table.Cell>
                <Table.Cell>string</Table.Cell>
                <Table.Cell>PC</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>6</Table.Cell>
                <Table.Cell>振替</Table.Cell>
                <Table.Cell>boolean (true/1/false/0)</Table.Cell>
                <Table.Cell>false</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>
        </div>
        <div>
          <Label>サンプル</Label>
          <p class="text-muted-foreground">ABC銀行,2025-06-21,-123456,日用品,PC,false</p>
        </div>
      </div>
    </Dialog.Header>
  </Dialog.Content>
</Dialog.Root>
