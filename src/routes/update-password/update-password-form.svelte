<script lang="ts">
  import PasswordInput from '$lib/components/password-input.svelte';
  import * as Alert from '$lib/components/ui/alert/index.js';
  import * as Form from '$lib/components/ui/form/index.js';
  import { updatePasswordSchema, type UpdatePasswordSchema } from '$lib/schema/updatePassword';
  import { CircleAlertIcon, LoaderCircle } from '@lucide/svelte';
  import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';

  let { data }: { data: { form: SuperValidated<Infer<UpdatePasswordSchema>> } } = $props();

  const form = superForm(data.form, {
    validators: zodClient(updatePasswordSchema)
  });

  const { form: formData, enhance, submitting, message } = form;
</script>

<form method="POST" use:enhance>
  <div class="space-y-4">
    {#if $message}
      <Alert.Root variant="destructive">
        <CircleAlertIcon class="size-4" />
        <Alert.Description>{$message}</Alert.Description>
      </Alert.Root>
    {/if}

    <Form.Field {form} name="currentPassword">
      <Form.Control>
        {#snippet children({ props })}
          <div>
            <Form.Label>現在のパスワード</Form.Label>
            <PasswordInput bind:value={$formData.currentPassword} {...props} />
          </div>
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="newPassword">
      <Form.Control>
        {#snippet children({ props })}
          <div>
            <Form.Label>新しいパスワード</Form.Label>
            <PasswordInput bind:value={$formData.newPassword} {...props} />
          </div>
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="confirmPassword">
      <Form.Control>
        {#snippet children({ props })}
          <div>
            <Form.Label>新しいパスワード（確認用）</Form.Label>
            <PasswordInput bind:value={$formData.confirmPassword} {...props} />
          </div>
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>

    <Form.Button class="w-full" disabled={$submitting}>
      変更
      {#if $submitting}
        <LoaderCircle class="animate-spin" />
      {/if}
    </Form.Button>
  </div>
</form>
