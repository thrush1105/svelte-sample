<script lang="ts">
  import { applyAction, enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Label } from '$lib/components/ui/label/index.js';
  import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
  import { cn } from '$lib/utils';
  import { LoaderCircle } from '@lucide/svelte';
  import type { PageProps } from './$types';

  let { form }: PageProps = $props();

  let isGenreSpecified = $state('false');
  let genre = $state('');
  let difficulty = $state('普通');
  let isLoading = $state(false);
</script>

<svelte:head>
  <title>クイズ生成</title>
</svelte:head>

<p class="text-2xl font-bold">クイズ生成</p>

{#if form?.error}
  <p class="text-destructive">{form.error.message}</p>
{/if}

<form
  method="POST"
  action="?/generate"
  use:enhance={() => {
    isLoading = true;
    return async ({ result }) => {
      if (result.type === 'redirect') {
        goto(result.location);
      } else {
        isLoading = false;
        await applyAction(result);
      }
    };
  }}
>
  <div class="space-y-4">
    <RadioGroup.Root
      bind:value={isGenreSpecified}
      onValueChange={() => {
        genre = '';
      }}
    >
      <Label>ジャンル</Label>
      <div class="flex gap-4">
        <div class="flex items-center space-x-2">
          <RadioGroup.Item value="true" id="specified-genre" class="hover:cursor-pointer" />
          <Label for="specified-genre" class="hover:cursor-pointer">指定する</Label>
        </div>
        <div class="flex items-center space-x-2">
          <RadioGroup.Item value="false" id="unspecified-genre" class="hover:cursor-pointer" />
          <Label for="unspecified-genre" class="hover:cursor-pointer">指定しない</Label>
        </div>
      </div>
    </RadioGroup.Root>

    {#if isGenreSpecified === 'true'}
      <Input name="genre" bind:value={genre} placeholder="ジャンル" />
    {/if}

    <RadioGroup.Root name="difficulty" bind:value={difficulty}>
      <Label>難易度</Label>
      <div class="flex gap-4">
        <div class="flex items-center space-x-2">
          <RadioGroup.Item value="簡単" id="difficulty-easy" class="hover:cursor-pointer" />
          <Label for="difficulty-easy" class="hover:cursor-pointer">簡単</Label>
        </div>
        <div class="flex items-center space-x-2">
          <RadioGroup.Item value="普通" id="difficulty-normal" class="hover:cursor-pointer" />
          <Label for="difficulty-normal" class="hover:cursor-pointer">普通</Label>
        </div>
        <div class="flex items-center space-x-2">
          <RadioGroup.Item value="難しい" id="difficulty-hard" class="hover:cursor-pointer" />
          <Label for="difficulty-hard" class="hover:cursor-pointer">難しい</Label>
        </div>
        <div class="flex items-center space-x-2">
          <RadioGroup.Item value="とても難しい" id="difficulty-very-hard" class="hover:cursor-pointer" />
          <Label for="difficulty-very-hard" class="hover:cursor-pointer">とても難しい</Label>
        </div>
      </div>
    </RadioGroup.Root>

    <Button type="submit" disabled={isLoading}>
      <LoaderCircle class={cn('animate-spin', !isLoading && 'hidden')} />
      生成する
    </Button>
  </div>
</form>
