<script lang="ts">
  import { afterNavigate, beforeNavigate, goto } from '$app/navigation';
  import { page } from '$app/state';
  import AppPagination from '$lib/components/app-pagination.svelte';
  import FourChoiceQuiz from '$lib/components/four-choice-quiz.svelte';
  import SearchInput from '$lib/components/search-input.svelte';
  import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
  import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
  import Label from '$lib/components/ui/label/label.svelte';
  import * as Select from '$lib/components/ui/select/index.js';
  import { cn } from '$lib/utils.js';
  import { Plus } from '@lucide/svelte';
  import { onMount } from 'svelte';

  let { data } = $props();
  let { total } = $derived(data);

  let { quizzes } = $derived(data);
  let pageNumber = $state(data.page);
  let perPage = $state(data.perPage);
  let perPageString = $state(String(data.perPage));
  let from = $state(data.from);
  let numberOfAnswered = $state(0);
  let numberOfCorrectAnswers = $state(0);
  let isLoading = $state(false);
  let favorite = $state(false);
  let text = $state('');

  onMount(() => {
    const params = page.url.searchParams;
    favorite = (params.get('favorite') ?? '') === 'true';
    text = params.get('text') ?? '';
  });

  beforeNavigate(() => {
    isLoading = true;
  });

  afterNavigate(() => {
    isLoading = false;
  });

  const onAnswered = (isCorrect: boolean) => {
    numberOfAnswered++;
    if (isCorrect) numberOfCorrectAnswers++;
  };

  const changeQuery = (
    params: Record<string, string | number | boolean | null>,
    opts?: { noScroll: boolean }
  ) => {
    const url = new URL(page.url.href);
    for (const key in params) {
      if (params[key] === null) {
        url.searchParams.delete(key);
      } else {
        let value = params[key];
        if (typeof value === 'number' || typeof value === 'boolean') value = String(value);
        url.searchParams.set(key, value);
      }
    }
    goto(url, { ...{ keepFocus: true, noScroll: true }, ...opts });
  };

  const changePage = (value: number) => {
    pageNumber = value;
    from = perPage * (pageNumber - 1);

    changeQuery({ page: pageNumber }, { noScroll: false });
  };

  const changePerPage = (value: string) => {
    perPage = parseInt(value) ?? 5;
    pageNumber = Math.floor(from / perPage) + 1;
    from = perPage * (pageNumber - 1);

    changeQuery({ page: pageNumber, perPage: perPage });
  };

  const filterFavorite = () => {
    if (favorite) changeQuery({ favorite: favorite, page: null });
    else changeQuery({ favorite: null, page: null });
  };

  const searchText = () => {
    if (text) changeQuery({ text: text, page: null });
    else changeQuery({ text: null, page: null });
  };
</script>

<svelte:head>
  <title>クイズ</title>
</svelte:head>

{@render showFavorite()}

{@render searchInput()}

<div class="flex items-center gap-4">
  {@render perPageSelect()}
  {@render generateQuizzesButton()}
</div>

{@render quizzesContent()}

{#if quizzes.length === 0}
  {@render noResult()}
{:else if numberOfAnswered === quizzes.length}
  {@render quizResult()}
{/if}

{#if total > perPage}
  <AppPagination count={total} bind:page={pageNumber} {perPage} onPageChange={changePage} />
{/if}

{#snippet showFavorite()}
  <div class="flex items-center gap-2">
    <Checkbox bind:checked={favorite} id="check-favorite" onCheckedChange={filterFavorite} />
    <Label for="check-favorite" class="hover:cursor-pointer">お気に入り</Label>
  </div>
{/snippet}

{#snippet searchInput()}
  <SearchInput
    bind:value={text}
    onkeydown={(e: KeyboardEvent) => {
      if (e.key === 'Enter') searchText();
    }}
  />
{/snippet}

{#snippet generateQuizzesButton()}
  <Button variant="outline" href="/quiz/generate">
    <Plus />
    クイズを生成する
  </Button>
{/snippet}

{#snippet perPageSelect()}
  <Select.Root type="single" bind:value={perPageString} onValueChange={changePerPage}>
    <Select.Trigger class="w-36">{`${perPageString} 問/ページ`}</Select.Trigger>
    <Select.Content>
      <Select.Item value="5">5 問/ページ</Select.Item>
      <Select.Item value="10">10 問/ページ</Select.Item>
      <Select.Item value="20">20 問/ページ</Select.Item>
      <Select.Item value="50">50 問/ページ</Select.Item>
      <Select.Item value="100">100 問/ページ</Select.Item>
    </Select.Content>
  </Select.Root>
{/snippet}

{#snippet quizzesContent()}
  <div class="space-y-4">
    {#each quizzes as quiz, index}
      <FourChoiceQuiz
        {quiz}
        number={index + 1}
        {isLoading}
        onAnswered={(answerChoiceId: string, isCorrect: boolean) => onAnswered(isCorrect)}
      />
    {/each}
  </div>
{/snippet}

{#snippet quizResult()}
  <div class="space-y-2">
    <p class="text-2xl font-bold">結果</p>
    {#if numberOfCorrectAnswers === quizzes.length}
      <p class="text-lg font-bold text-green-600">全問正解！</p>
    {/if}
    <p class="text-lg">
      {numberOfCorrectAnswers} / {quizzes.length} 正解
    </p>
  </div>

  <a href="/quiz/generate" class={cn(buttonVariants())}>もう一度クイズを生成する</a>
{/snippet}

{#snippet noResult()}
  <p>検索結果はありません。</p>
{/snippet}
