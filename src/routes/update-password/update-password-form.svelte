<script lang="ts">
  import { page } from '$app/state';
  import ErrorAlert from '$lib/components/error-alert.svelte';
  import PasswordInput from '$lib/components/password-input.svelte';
  import * as Form from '$lib/components/ui/form/index.js';
  import { LoaderCircle } from '@lucide/svelte';
  import { toast } from 'svelte-sonner';
  import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { updatePasswordSchema, type UpdatePasswordSchema } from './schema';

  let { data }: { data: { form: SuperValidated<Infer<UpdatePasswordSchema>> } } = $props();

  const form = superForm(data.form, {
    validators: zodClient(updatePasswordSchema),
    onError({ result }) {
      toast.error(result.error.message, { position: 'bottom-right', richColors: true });
    }
  });

  const { form: formData, enhance, submitting, delayed, message } = form;
</script>

{#if page.status >= 400}
  <ErrorAlert title="エラー" message={$message} />
{/if}

<form method="POST" use:enhance>
  <div class="flex flex-col space-y-4">
    <Form.Field {form} name="currentPassword">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>現在のパスワード</Form.Label>
          <PasswordInput bind:value={$formData.currentPassword} {...props} />
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="newPassword">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>新しいパスワード</Form.Label>
          <PasswordInput bind:value={$formData.newPassword} {...props} />
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="confirmPassword">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>新しいパスワード（確認用）</Form.Label>
          <PasswordInput bind:value={$formData.confirmPassword} {...props} />
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>

    <Form.Button disabled={$submitting}>
      変更
      {#if $delayed}
        <LoaderCircle class="animate-spin" />
      {/if}
    </Form.Button>
  </div>
</form>
