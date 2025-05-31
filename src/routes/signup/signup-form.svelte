<script lang="ts">
  import PasswordInput from '$lib/components/password-input.svelte';
  import * as Alert from '$lib/components/ui/alert/index.js';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { signupFormSchema, type SignupFormSchema } from '$lib/schema/singup';
  import { CircleAlertIcon, LoaderCircle } from '@lucide/svelte';
  import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';

  let { data }: { data: { form: SuperValidated<Infer<SignupFormSchema>> } } = $props();

  const form = superForm(data.form, {
    validators: zodClient(signupFormSchema)
  });

  const { form: formData, enhance, submitting, message } = form;
</script>

<form method="POST" action="?/singup" use:enhance>
  <div class="space-y-4">
    {#if $message}
      <Alert.Root variant="destructive">
        <CircleAlertIcon class="size-4" />
        <Alert.Description>{$message}</Alert.Description>
      </Alert.Root>
    {/if}

    <Form.Field {form} name="email">
      <Form.Control>
        {#snippet children({ props })}
          <div>
            <Form.Label>メールアドレス</Form.Label>
            <Input bind:value={$formData.email} placeholder="メールアドレス" {...props} />
          </div>
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="password">
      <Form.Control>
        {#snippet children({ props })}
          <div>
            <Form.Label>パスワード</Form.Label>
            <PasswordInput bind:value={$formData.password} {...props} />
          </div>
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>

    <Form.Button class="w-full" disabled={$submitting}>
      登録
      {#if $submitting}
        <LoaderCircle class="animate-spin" />
      {/if}
    </Form.Button>
  </div>
</form>
