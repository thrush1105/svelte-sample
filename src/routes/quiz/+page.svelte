<script lang="ts">
  import { goto } from '$app/navigation';
  import AppPagination from '$lib/components/app-pagination.svelte';
  import FourChoiceQuiz from '$lib/components/four-choice-quiz.svelte';
  import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
  import * as Select from '$lib/components/ui/select/index.js';
  import { cn } from '$lib/utils.js';
  import { Plus } from '@lucide/svelte';
  import { fetchQuizzes } from '../quiz.js';
  let { data } = $props();
  let { groupId, total } = $derived(data);

  let { quizzes } = $derived(data);
  let page = $state(data.page);
  let perPage = $state(data.perPage);
  let perPageString = $state(String(data.perPage));
  let from = $state(data.from);
  let to = $state(data.to);
  let numberOfAnswered = $state(0);
  let numberOfCorrectAnswers = $state(0);
  let isLoading = $state(false);

  const onAnswered = async (isCorrect: boolean) => {
    numberOfAnswered++;
    if (isCorrect) numberOfCorrectAnswers++;
  };

  const changePage = async (value: number) => {
    page = value;
    from = perPage * (page - 1);

    const url = new URL(window.location.href);
    url.searchParams.set('page', String(page));

    isLoading = true;

    goto(url).finally(() => {
      isLoading = false;
    });
  };

  const changePerPage = async (value: string) => {
    perPage = parseInt(value) ?? 5;
    page = Math.floor(from / perPage) + 1;
    from = perPage * (page - 1);
    to = from + perPage - 1;

    const url = new URL(window.location.href);
    url.searchParams.set('page', String(page));
    url.searchParams.set('perPage', String(perPage));

    isLoading = true;

    goto(url, { keepFocus: true, noScroll: true }).finally(() => {
      isLoading = false;
    });
  };
</script>

<svelte:head>
  <title>クイズ</title>
</svelte:head>

<div class="flex items-center justify-between">
  {@render perPageSelect()}
  {@render generateQuizzesButton()}
</div>

<div class="space-y-4">
  {#each quizzes as quiz, index}
    <FourChoiceQuiz
      {quiz}
      number={index + 1}
      {isLoading}
      isFavorite={quiz.is_favorite}
      onAnswered={(answerChoiceId: string, isCorrect: boolean) => onAnswered(isCorrect)}
    />
  {/each}

  {#if quizzes.length === 0}
    {@render noResult()}
  {:else if numberOfAnswered === quizzes.length}
    {@render quizResult()}
  {/if}
</div>

{#if total > perPage}
  <AppPagination count={total} bind:page {perPage} onPageChange={changePage} />
{/if}

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
