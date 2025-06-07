<script lang="ts">
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import ErrorAlert from '$lib/components/error-alert.svelte';
  import Button from '$lib/components/ui/button/button.svelte';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import { toast } from 'svelte-sonner';

  type Props = {
    open?: boolean;
  };

  let { open = $bindable(false) }: Props = $props();

  let errorMessage: string | null | undefined = $state(null);

  $effect(() => {
    if (open) {
      errorMessage = null;
    }
  });
</script>

<Dialog.Root bind:open>
  <Dialog.Content>
    <form
      method="POST"
      action="/login?/logout"
      class="space-y-4"
      use:enhance={() => {
        return async ({ result }) => {
          if (result.type === 'redirect') {
            open = false;
            goto(result.location, { invalidateAll: true });
          } else if (result.type === 'failure') {
            errorMessage = result.data?.message as string | null | undefined;
          } else if (result.type === 'error') {
            errorMessage = null;
            toast.error(result.error.message, { position: 'bottom-right', richColors: true });
          }
        };
      }}
    >
      <Dialog.Header>
        <Dialog.Title>ログアウトしますか？</Dialog.Title>
      </Dialog.Header>

      <ErrorAlert title="エラー" message={errorMessage} />

      <Dialog.Footer>
        <Button variant="secondary" onclick={() => (open = false)}>キャンセル</Button>
        <Button type="submit">ログアウト</Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
