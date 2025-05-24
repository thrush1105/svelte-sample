<script lang="ts">
  import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';

  let { open = $bindable(false), message }: { open: boolean; message: string } = $props();
</script>

<AlertDialog.Root bind:open>
  <AlertDialog.Content interactOutsideBehavior="close">
    <AlertDialog.Header>
      <AlertDialog.Title>エラー</AlertDialog.Title>
      <AlertDialog.Description>
        {message}
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>閉じる</AlertDialog.Cancel>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
