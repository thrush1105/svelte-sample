<script lang="ts">
  import FourChoiceQuiz from '$lib/components/four-choice-quiz.svelte';
  import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
  import { cn } from '$lib/utils.js';
  import { Plus } from '@lucide/svelte';

  let { data } = $props();
  let { quizzes } = $derived(data);

  let numberOfAnswered = $state(0);
  let numberOfCorrectAnswers = $state(0);

  const onAnswered = async (isCorrect: boolean) => {
    numberOfAnswered++;
    if (isCorrect) numberOfCorrectAnswers++;
  };
</script>

<svelte:head>
  <title>クイズ</title>
</svelte:head>

<div class="flex items-center justify-end">
  <Button variant="outline" href="/quiz/generate">
    <Plus />
    クイズを生成する
  </Button>
</div>

<div class="space-y-4">
  {#each quizzes as quiz, index}
    <FourChoiceQuiz
      {quiz}
      number={index + 1}
      onAnswered={(answerChoiceId: string, isCorrect: boolean) => onAnswered(isCorrect)}
    />
  {/each}

  {#if numberOfAnswered === quizzes.length}
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
  {/if}
</div>
