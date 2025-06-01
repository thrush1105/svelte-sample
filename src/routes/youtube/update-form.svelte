<script lang="ts">
  import { applyAction, enhance } from '$app/forms';
  import * as Form from '$lib/components/ui/form/index.js';
  import { LoaderCircle } from '@lucide/svelte';

  type Props = {
    onUpdated?: () => void;
  };

  let { onUpdated }: Props = $props();

  let submitting = $state(false);
</script>

<form
  method="POST"
  action="?/update"
  use:enhance={() => {
    submitting = true;
    return async ({ result }) => {
      submitting = false;
      await applyAction(result);
      onUpdated?.();
    };
  }}
>
  <div class="space-y-4">
    <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
      <Form.Button disabled={submitting}>
        更新
        {#if submitting}
          <LoaderCircle class="animate-spin" />
        {/if}
      </Form.Button>
    </div>
  </div>
</form>
