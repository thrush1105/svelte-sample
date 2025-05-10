export type Quiz = {
  id?: number;
  group_id?: string;
  genre: string | null;
  difficulty: string | null;
  question: string;
  explanation: string | null;
  choices: {
    A: string;
    B: string;
    C: string;
    D: string;
  } | null;
  correct_choice_id: string | null;
  answer_choice_id?: string | null;
  is_correct?: boolean | null;
  is_favorite?: boolean;
};
