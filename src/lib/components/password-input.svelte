<script lang="ts">
  import Input from '$lib/components/ui/input/input.svelte';
  import { Eye, EyeOff } from '@lucide/svelte';

  type Props = {
    value?: string | null;
  };

  let { value = $bindable(), ...restProps }: Props = $props();

  let isPasswordVisible = $state(false);
</script>

<div class="relative">
  <Input
    bind:value
    type={isPasswordVisible ? 'text' : 'password'}
    {...restProps}
    required
    class="pr-10"
  />
  <button
    type="button"
    class="text-muted-foreground/60 hover:text-muted-foreground/80 absolute top-1/2 right-4 -translate-y-1/2"
    onclick={() => (isPasswordVisible = !isPasswordVisible)}
  >
    {#if isPasswordVisible}
      <Eye size={20} />
    {:else}
      <EyeOff size={20} />
    {/if}
  </button>
</div>
