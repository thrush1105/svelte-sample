<script lang="ts">
  import type { Quiz } from '$lib/types';
  import { cn } from '$lib/utils';
  import Button from './ui/button/button.svelte';

  type Props = {
    quiz: Quiz;
    number: number;
    onAnswered?: (answerChoiceId: string, isCorrect: boolean) => void;
  };

  let { quiz, number, onAnswered }: Props = $props();

  let correctChoiceText = $derived.by(() => {
    if (
      quiz.choices &&
      (quiz.correct_choice_id === 'A' ||
        quiz.correct_choice_id === 'B' ||
        quiz.correct_choice_id === 'C' ||
        quiz.correct_choice_id === 'D')
    ) {
      return quiz.choices[quiz.correct_choice_id];
    } else {
      return null;
    }
  });

  let answerChoiceId = $state('');
  let isAnswered = $derived(answerChoiceId.trim().length > 0);
  let isCorrect = $state(false);

  /**
   * クイズに回答する
   * @param choiceId
   */
  const answerQuiz = (choiceId: string) => {
    answerChoiceId = choiceId;
    isCorrect = choiceId === quiz.correct_choice_id;

    onAnswered?.(answerChoiceId, isCorrect);
  };
</script>

<div class="space-y-2">
  <p class="text-2xl font-bold">Q.{number}</p>
  <p>{quiz.question}</p>
  <div class="grid space-y-2 px-2">
    {#if quiz.choices}
      {#each Object.entries(quiz.choices) as [choiceId, choiceText]}
        <Button
          variant="outline"
          class={cn(
            isAnswered && choiceId === quiz.correct_choice_id ? 'bg-green-200' : '',
            isAnswered && choiceId === answerChoiceId && !isCorrect ? 'bg-red-200' : ''
          )}
          disabled={isAnswered}
          onclick={() => answerQuiz(choiceId)}
        >
          {choiceText}
        </Button>
      {/each}
    {/if}
  </div>

  {#if isAnswered}
    {#if isCorrect}
      <p class="text-lg font-bold text-green-600">正解！</p>
    {:else}
      <p class="text-lg font-bold text-red-600">不正解...</p>
    {/if}
    <p>A: <span class="text-lg font-bold">{correctChoiceText}</span></p>
    <p>{quiz.explanation}</p>
  {/if}
</div>
