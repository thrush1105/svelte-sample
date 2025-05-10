import { openai } from '$lib/openaiClient';

export const generateQuizzesWithAI = async (model: string, userInputText: string) => {
  return await openai.responses.create({
    model: model,
    input: [
      {
        role: 'system',
        content: [
          {
            type: 'input_text',
            text: [
              'あなたはプロのクイズ作家です。',
              '信頼できる情報に基づいて正確なクイズを生成してください。',
              'ユーザーはクイズのジャンルを指定することができます。指定がない場合はランダムな分野からクイズを出題してください。',
              '択一クイズを生成する場合は、選択肢をアルファベット大文字にしてください。',
              'クイズの難易度は以下の4つを指定可能とします。',
              '- 簡単: 大学を卒業した人の正答率が80%前後',
              '- 普通: 大学を卒業した人の正答率が50%前後',
              '- 難しい: 大学を卒業した人の正答率が20%前後',
              '- とても難しい: 大学を卒業した人の正答率が5%前後'
            ].join('\n')
          }
        ]
      },
      {
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: userInputText
          }
        ]
      }
    ],
    text: {
      format: {
        type: 'json_schema',
        name: 'quiz_schema',
        strict: true,
        schema: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              description: 'A collection of quiz questions.',
              items: {
                type: 'object',
                properties: {
                  genre: {
                    type: 'string',
                    description: 'The genre of the quiz question.'
                  },
                  difficulty: {
                    type: 'string',
                    description: 'The difficulty level of the quiz question.'
                  },
                  question: {
                    type: 'string',
                    description: 'The quiz question being asked.'
                  },
                  explanation: {
                    type: 'string',
                    description: 'Explanation of the correct answer.'
                  },
                  choices: {
                    type: 'object',
                    description: 'The possible choices for the quiz question.',
                    properties: {
                      A: {
                        type: 'string',
                        description: 'Choice A for the quiz question.'
                      },
                      B: {
                        type: 'string',
                        description: 'Choice B for the quiz question.'
                      },
                      C: {
                        type: 'string',
                        description: 'Choice C for the quiz question.'
                      },
                      D: {
                        type: 'string',
                        description: 'Choice D for the quiz question.'
                      }
                    },
                    required: ['A', 'B', 'C', 'D'],
                    additionalProperties: false
                  },
                  correct_choice_id: {
                    type: 'string',
                    description: 'The identifier for the correct choice.',
                    enum: ['A', 'B', 'C', 'D']
                  }
                },
                required: [
                  'genre',
                  'difficulty',
                  'question',
                  'explanation',
                  'choices',
                  'correct_choice_id'
                ],
                additionalProperties: false
              }
            }
          },
          required: ['data'],
          additionalProperties: false
        }
      }
    }
  });
};
