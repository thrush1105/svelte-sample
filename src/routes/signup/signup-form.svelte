<script lang="ts">
  import { page } from '$app/state';
  import ErrorAlert from '$lib/components/error-alert.svelte';
  import PasswordInput from '$lib/components/password-input.svelte';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { LoaderCircle } from '@lucide/svelte';
  import { toast } from 'svelte-sonner';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { signupFormSchema, type SignupFormSchema } from './schema';

  let { data }: { data: { form: SuperValidated<Infer<SignupFormSchema>> } } = $props();

  const form = superForm(data.form, {
    validators: zodClient(signupFormSchema),
    onError({ result }) {
      toast.error(result.error.message, { position: 'bottom-right', richColors: true });
    }
  });

  const { form: formData, enhance, submitting, delayed, message } = form;
</script>

<form method="POST" action="?/singup" use:enhance>
  <div class="flex flex-col space-y-4">
    {#if page.status >= 400}
      <ErrorAlert title="エラー" message={$message} />
    {/if}

    <Form.Field {form} name="email">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>メールアドレス</Form.Label>
          <Input bind:value={$formData.email} {...props} required />
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="password">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>パスワード</Form.Label>
          <PasswordInput bind:value={$formData.password} {...props} />
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>

    <Form.Button disabled={$submitting}>
      登録
      {#if $delayed}
        <LoaderCircle class="animate-spin" />
      {/if}
    </Form.Button>
  </div>
</form>
