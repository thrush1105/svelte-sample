<script lang="ts">
  import { page } from '$app/state';
  import ErrorAlert from '$lib/components/error-alert.svelte';
  import Button from '$lib/components/ui/button/button.svelte';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { LoaderCircle } from '@lucide/svelte';
  import { toast } from 'svelte-sonner';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { addVideoFormSchema, type AddVideoFormSchema } from './schema';

  let {
    data,
    onUpdate,
    onCancel
  }: {
    data: SuperValidated<Infer<AddVideoFormSchema>>;
    onUpdate?: () => void;
    onCancel?: () => void;
  } = $props();

  const form = superForm(data, {
    validators: zodClient(addVideoFormSchema),
    onUpdate: ({ form, result }) => {
      if (result.type === 'success') {
        toast.success(form.message, { position: 'bottom-right', richColors: true });
        onUpdate?.();
      }
    },
    onError({ result }) {
      toast.error(result.error.message, { position: 'bottom-right', richColors: true });
    }
  });

  const { form: formData, enhance, submitting, delayed, message } = form;
</script>

<form method="POST" action="?/add" use:enhance>
  <div class="space-y-4">
    {#if page.status >= 400}
      <ErrorAlert title="エラー" message={$message} />
    {/if}

    <Form.Field {form} name="url">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>URL</Form.Label>
          <Input
            bind:value={$formData.url}
            {...props}
            placeholder="https://www.youtube.com/watch?v=..."
            required
          />
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>

    <div class="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end">
      <Button variant="secondary" onclick={onCancel}>キャンセル</Button>
      <Form.Button disabled={$submitting}>
        追加
        {#if $submitting}
          <LoaderCircle class="animate-spin" />
        {/if}
      </Form.Button>
    </div>
  </div>
</form>
