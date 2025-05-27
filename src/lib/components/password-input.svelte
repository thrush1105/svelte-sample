<script lang="ts">
  import { Eye, EyeOff } from '@lucide/svelte';
  import Input from './ui/input/input.svelte';

  let { value = $bindable(), name, placeholder = 'パスワード' } = $props();

  let isPasswordVisible = $state(false);
</script>

<div class="relative">
  <Input
    bind:value
    type={isPasswordVisible ? 'text' : 'password'}
    {name}
    {placeholder}
    required
    minlength={8}
    class="w-full pr-10"
  />
  <button
    type="button"
    class="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-muted-foreground/80"
    onclick={() => (isPasswordVisible = !isPasswordVisible)}
  >
    {#if isPasswordVisible}
      <Eye size={20} />
    {:else}
      <EyeOff size={20} />
    {/if}
  </button>
</div>
