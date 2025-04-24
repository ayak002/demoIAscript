import { config } from 'dotenv';
config();

import readline from 'readline';
import { OpenAI } from 'openai';
import { evaluate } from 'mathjs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "calculate",
      description: "Perform basic math calculations.",
      parameters: {
        type: "object",
        properties: {
          expression: {
            type: "string",
            description: "A mathematical expression e.g. '2 + 7 * (8 - 4)'"
          }
        },
        required: ["expression"]
      }
    }
  }
];

async function handleToolCall(toolCall: OpenAI.Chat.Completions.ChatCompletionMessageToolCall): Promise<string> {
  if (toolCall.function.name === 'calculate') {
    const { expression } = JSON.parse(toolCall.function.arguments);
    try {
      const result = evaluate(expression);
      return result.toString();
    } catch {
      return 'Invalid math expression.';
    }
  }

  return 'Unknown tool call.';
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Ask → ',
});

console.log('Type your question/s. Type "exit" to quit.\n');
rl.prompt();

rl.on('line', async (line) => {
  const input = line.trim();

  if (['exit', 'quit', 'q'].includes(input.toLowerCase())) {
    rl.close();
    return;
  }

  try {
    const chat = await openai.chat.completions.create({
      model: 'gpt-4-1106-preview',
      messages: [{ role: 'user', content: input }],
      tools,
      tool_choice: "auto"
    });

    const choice = chat.choices[0];

    if (choice.finish_reason === 'tool_calls' && choice.message.tool_calls?.length) {
      const toolCall = choice.message.tool_calls[0];

      const result = await handleToolCall(toolCall);

      const followUp = await openai.chat.completions.create({
        model: 'gpt-4-1106-preview',
        messages: [
          { role: 'user', content: input },
          {
            role: 'assistant',
            tool_calls: [toolCall]
          },
          {
            role: 'tool',
            tool_call_id: toolCall.id,
            content: result
          }
        ]
      });

      console.log('\n🤖 Response:', followUp.choices[0].message.content, '\n');
    } else {
      console.log('\n🤖 Response:', choice.message.content, '\n');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }

  rl.prompt();
});

rl.on('close', () => {
  console.log('\n👋 Goodbye!');
  process.exit(0);
});
