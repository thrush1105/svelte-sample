<script lang="ts">
  import { goto } from '$app/navigation';
  import Button from '$lib/components/ui/button/button.svelte';
  import Input from '$lib/components/ui/input/input.svelte';
  import Label from '$lib/components/ui/label/label.svelte';
  import * as Select from '$lib/components/ui/select/index.js';
  import { LoaderCircle, Plus, Trash2 } from '@lucide/svelte';
  import { toast } from 'svelte-sonner';
  import type { Transaction } from '../schema';

  let { data: transactions = $bindable([]) }: { data?: Transaction[] } = $props();

  let submitting = $state(false);
  let serverResponse = $state<any>();

  const addItem = () => {
    transactions.push({
      date: '',
      service: '',
      amount: 0,
      category: '',
      description: '',
      isTransfer: false
    });
  };

  const deleteItem = (i: number) => {
    transactions = transactions.filter((item, index) => index !== i);
    serverResponse = undefined;
  };

  const submit = async () => {
    submitting = true;

    try {
      const response = await fetch('/transactions/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(transactions)
      });

      if (response.ok) {
        goto('/transactions');
      } else if (response.status === 401) {
        goto('/login');
      } else if (response.status === 400) {
        serverResponse = await response.json();
      } else {
        const responseText = await response.json();
        toast.error(responseText?.message, { position: 'bottom-right', richColors: true });
      }
    } catch (e) {
      console.error(e);
    } finally {
      submitting = false;
    }
  };
</script>

<Button variant="outline" onclick={addItem}>
  <Plus />
  行を追加
</Button>

<div class="space-y-4">
  {#each transactions as transaction, i}
    <div>
      <div class="flex flex-col gap-2 sm:flex-row">
        <div class="space-y-2">
          <Label>サービス名</Label>
          <Input bind:value={transaction.service} class="sm:w-auto" />
          <div class="text-destructive text-sm font-medium">
            {#each serverResponse?.items?.[i]?.properties?.service?.errors ?? [] as message}
              <p>{message}</p>
            {/each}
          </div>
        </div>

        <div class="space-y-2">
          <Label>取引日</Label>
          <Input type="date" bind:value={transaction.date} class="sm:w-auto" />
          <div class="text-destructive text-sm font-medium">
            {#each serverResponse?.items?.[i]?.properties?.date?.errors ?? [] as message}
              <p>{message}</p>
            {/each}
          </div>
        </div>

        <div class="space-y-2">
          <Label>カテゴリー</Label>
          <Input bind:value={transaction.category} class="sm:w-auto" />
          <div class="text-destructive text-sm font-medium">
            {#each serverResponse?.items?.[i]?.properties?.category?.errors ?? [] as message}
              <p>{message}</p>
            {/each}
          </div>
        </div>

        <div class="space-y-2">
          <Label>内容</Label>
          <Input bind:value={transaction.description} class="sm:w-auto" />
          <div class="text-destructive text-sm font-medium">
            {#each serverResponse?.items?.[i]?.properties?.description?.errors ?? [] as message}
              <p>{message}</p>
            {/each}
          </div>
        </div>

        <div class="space-y-2">
          <Label>金額</Label>
          <Input type="number" bind:value={transaction.amount} class="sm:w-auto" />
          <div class="text-destructive text-sm font-medium">
            {#each serverResponse?.items?.[i]?.properties?.amount?.errors ?? [] as message}
              <p>{message}</p>
            {/each}
          </div>
        </div>

        <div class="space-y-2">
          <Label>振替</Label>
          <Select.Root
            type="single"
            value={transaction.isTransfer ? 'true' : 'false'}
            onValueChange={(v) => {
              transaction.isTransfer = v === 'true';
            }}
          >
            <Select.Trigger>{transaction.isTransfer}</Select.Trigger>
            <Select.Content>
              <Select.Item value="true">true</Select.Item>
              <Select.Item value="false">false</Select.Item>
            </Select.Content>
          </Select.Root>
          <div class="text-destructive text-sm font-medium">
            {#each serverResponse?.items?.[i]?.properties?.isTransfer?.errors ?? [] as message}
              <p>{message}</p>
            {/each}
          </div>
        </div>

        <div class="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            class="hover:bg-destructive/10 focus-visible:ring-destructive/20 text-destructive hover:text-destructive rounded-full"
            onclick={() => deleteItem(i)}
          >
            <Trash2 />
          </Button>
        </div>
      </div>
      <div class="text-destructive text-sm font-medium">
        {#each serverResponse?.fieldErrors?.[i] ?? [] as message}
          <p>{message}</p>
        {/each}
      </div>
    </div>
  {/each}
</div>

{#if transactions.length > 0}
  <Button onclick={submit}>
    登録
    {#if submitting}
      <LoaderCircle />
    {/if}
  </Button>
{/if}
