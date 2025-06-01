<script lang="ts">
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { LoaderCircle } from '@lucide/svelte';
  import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { formSchema, type FormSchema } from './schema';

  type Props = {
    data: { form: SuperValidated<Infer<FormSchema>> };
    onUpdated?: () => void;
  };

  let { data, onUpdated }: Props = $props();

  const form = superForm(data.form, {
    validators: zodClient(formSchema),
    onUpdated: ({ form }) => {
      if (form.valid) {
        onUpdated?.();
      }
    }
  });

  const { form: formData, enhance, submitting } = form;
</script>

<form method="POST" action="?/add" use:enhance>
  <div class="space-y-4">
    <Form.Field {form} name="url">
      <Form.Control>
        {#snippet children({ props })}
          <div>
            <Form.Label>URL</Form.Label>
            <Input {...props} bind:value={$formData.url} required />
          </div>
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
    <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
      <Form.Button disabled={$submitting}>
        追加
        {#if $submitting}
          <LoaderCircle class="animate-spin" />
        {/if}
      </Form.Button>
    </div>
  </div>
</form>
