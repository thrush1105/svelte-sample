<script lang="ts">
  import * as Alert from '$lib/components/ui/alert/index.js';
  import CircleAlertIcon from '@lucide/svelte/icons/circle-alert';

  type Props = {
    title?: string | null;
    message?: string | null;
  };

  let { title, message }: Props = $props();
</script>

{#if message}
  <Alert.Root variant="destructive">
    <CircleAlertIcon class="size-4" />
    <Alert.Title>{title}</Alert.Title>
    <Alert.Description>{message}</Alert.Description>
  </Alert.Root>
{/if}
