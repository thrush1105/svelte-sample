<script lang="ts">
  import { page } from '$app/state';
  import ErrorAlert from '$lib/components/error-alert.svelte';
  import Button from '$lib/components/ui/button/button.svelte';
  import * as Form from '$lib/components/ui/form/index.js';
  import { LoaderCircle } from '@lucide/svelte';
  import { toast } from 'svelte-sonner';
  import { defaults, superForm } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
  import type { Tables } from '../../database.types';
  import { deleteFormSchame } from './schema';

  let {
    data,
    onSuccess,
    onCancel
  }: { data: Tables<'transactions'>; onSuccess?: () => void; onCancel?: () => void } = $props();

  const form = superForm(defaults({ id: data.id }, zod(deleteFormSchame)), {
    onUpdate({ form, result }) {
      if (result.type === 'success') {
        toast.success(form.message, { position: 'bottom-right', richColors: true });
        onSuccess?.();
      }
    },
    onError({ result }) {
      toast.error(result.error.message, { position: 'bottom-right', richColors: true });
    }
  });

  const { form: formData, enhance, submitting, message } = form;
</script>

{#if page.status >= 400}
  <ErrorAlert title="エラー" message={$message} />
{/if}

<form method="POST" action="?/delete" use:enhance>
  <div class="space-y-4">
    <input type="hidden" name="id" value={$formData.id} />
    <div class="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end">
      <Button variant="secondary" onclick={onCancel}>キャンセル</Button>
      <Form.Button variant="destructive" disabled={$submitting}>
        削除
        {#if $submitting}
          <LoaderCircle class="animate-spin" />
        {/if}
      </Form.Button>
    </div>
  </div>
</form>
