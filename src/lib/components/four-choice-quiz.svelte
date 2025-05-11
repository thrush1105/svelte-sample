<script lang="ts">
  import { supabase } from '$lib/supabaseClient';
  import type { Quiz } from '$lib/types';
  import { cn } from '$lib/utils';
  import { Heart } from '@lucide/svelte';
  import Button from './ui/button/button.svelte';
  import { Skeleton } from '$lib/components/ui/skeleton/index.js';

  type Props = {
    quiz: Quiz;
    number: number;
    isLoading?: boolean;
    onAnswered?: (answerChoiceId: string, isCorrect: boolean) => void;
  };

  let { quiz, number, isLoading = false, onAnswered }: Props = $props();

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
  let isCorrect = $derived(answerChoiceId === quiz.correct_choice_id);
  let isFavorite = $derived(quiz.is_favorite);

  $effect(() => {
    answerChoiceId = '';
  });

  /**
   * クイズに回答する
   * @param choiceId
   */
  const answerQuiz = (choiceId: string) => {
    answerChoiceId = choiceId;
    onAnswered?.(answerChoiceId, isCorrect);
  };

  const addToFavorite = async () => {
    isFavorite = !isFavorite;

    const { error } = await supabase
      .from('quizzes')
      .update({ is_favorite: isFavorite, updated_at: new Date() })
      .eq('id', quiz.id);

    if (error) {
      console.error(error);
      isFavorite = !isFavorite;
    }
  };
</script>

<div class="space-y-2">
  <div class="flex items-center justify-between">
    {@render questionNumber()}
    {@render heartButton()}
  </div>

  {#if isLoading}
    {@render loadingUI()}
  {:else}
    {@render question()}
    {@render choiceButton()}
  {/if}

  {#if isAnswered}
    {@render answerResult()}
    {@render correctAnswer()}
    {@render explanation()}
  {/if}
</div>

{#snippet questionNumber()}
  <p class="text-2xl font-bold">Q.{number}</p>
{/snippet}

{#snippet heartButton()}
  <button
    class={cn(
      'rounded-full p-1.5 opacity-80 duration-300',
      !isLoading && isFavorite ? 'hover:bg-red-100' : 'hover:hover:bg-muted'
    )}
    onclick={addToFavorite}
  >
    <Heart
      size={20}
      color={!isLoading && isFavorite ? '#fb2c36' : '#000000'}
      fill={!isLoading && isFavorite ? '#fb2c36' : '#00000000'}
    />
  </button>
{/snippet}

{#snippet loadingUI()}
  <Skeleton class="h-8 w-full" />
  <Skeleton class="h-8 w-full" />
  <Skeleton class="h-8 w-full" />
  <Skeleton class="h-8 w-full" />
  <Skeleton class="h-8 w-full" />
{/snippet}

{#snippet question()}
  <p>{quiz.question}</p>
{/snippet}

{#snippet choiceButton()}
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
{/snippet}

{#snippet answerResult()}
  {#if isCorrect}
    <p class="text-lg font-bold text-green-600">正解！</p>
  {:else}
    <p class="text-lg font-bold text-red-600">不正解...</p>
  {/if}
{/snippet}

{#snippet correctAnswer()}
  <p>A: <span class="text-lg font-bold">{correctChoiceText}</span></p>
{/snippet}

{#snippet explanation()}
  <p>{quiz.explanation}</p>
{/snippet}
