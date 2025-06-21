<script lang="ts">
  import { page } from '$app/state';
  import ErrorAlert from '$lib/components/error-alert.svelte';
  import Button from '$lib/components/ui/button/button.svelte';
  import * as Form from '$lib/components/ui/form/index.js';
  import Input from '$lib/components/ui/input/input.svelte';
  import * as Select from '$lib/components/ui/select/index.js';
  import { LoaderCircle } from '@lucide/svelte';
  import { toast } from 'svelte-sonner';
  import { booleanProxy, defaults, superForm } from 'sveltekit-superforms';
  import { zod, zodClient } from 'sveltekit-superforms/adapters';
  import type { Tables } from '../../database.types';
  import { editFormSchame } from './schema';

  let {
    data,
    onSuccess,
    onCancel
  }: { data: Tables<'transactions'>; onSuccess?: () => void; onCancel?: () => void } = $props();

  const form = superForm(
    defaults(
      {
        id: data.id,
        service: data.service,
        date: data.date,
        amount: data.amount,
        category: data.category,
        description: data.description,
        isTransfer: data.is_transfer
      },
      zod(editFormSchame)
    ),
    {
      validators: zodClient(editFormSchame),
      onUpdate({ form, result }) {
        if (result.type === 'success') {
          toast.success(form.message, { position: 'bottom-right', richColors: true });
          onSuccess?.();
        }
      },
      onError({ result }) {
        toast.error(result.error.message, { position: 'bottom-right', richColors: true });
      }
    }
  );

  const { form: formData, enhance, submitting, message } = form;

  const proxyIsTransfer = booleanProxy(formData, 'isTransfer');
</script>

{#if page.status >= 400}
  <ErrorAlert title="エラー" message={$message} />
{/if}

<form method="POST" action="?/update" use:enhance>
  <div class="space-y-4">
    <input type="hidden" name="id" value={$formData.id} />

    <Form.Field {form} name="service">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>サービス名</Form.Label>
          <Input {...props} type="text" bind:value={$formData.service} required />
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="date">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>取引日</Form.Label>
          <Input {...props} type="date" bind:value={$formData.date} required />
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="amount">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>金額</Form.Label>
          <Input {...props} type="number" bind:value={$formData.amount} />
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="category">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>カテゴリー</Form.Label>
          <Input {...props} type="text" bind:value={$formData.category} />
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="description">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>内容</Form.Label>
          <Input {...props} type="text" bind:value={$formData.description} />
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="isTransfer">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>振替</Form.Label>
          <Select.Root
            type="single"
            name={props.name}
            value={$formData.isTransfer ? 'true' : 'false'}
            onValueChange={(v) => {
              $formData.isTransfer = v === 'true';
            }}
          >
            <Select.Trigger {...props}>{$formData.isTransfer}</Select.Trigger>
            <Select.Content>
              <Select.Item value="true">true</Select.Item>
              <Select.Item value="false">false</Select.Item>
            </Select.Content>
          </Select.Root>
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>

    <div class="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end">
      <Button variant="secondary" onclick={onCancel}>キャンセル</Button>
      <Form.Button disabled={$submitting}>
        確定
        {#if $submitting}
          <LoaderCircle class="animate-spin" />
        {/if}
      </Form.Button>
    </div>
  </div>
</form>
