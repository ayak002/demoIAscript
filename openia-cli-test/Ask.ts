import { config } from 'dotenv';
config();

import readline from 'readline';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Ask → ',
});

console.log('Type your questions. Type "exit" to quit.\n');
rl.prompt();

rl.on('line', async (line) => {
  const input = line.trim();

  if (input.toLowerCase() === 'exit' || input.toLowerCase() === 'quit' || input.toLowerCase() === 'q') {
    rl.close();
    return;
  }

  try {
    const chat = await openai.chat.completions.create({
      model: 'o1-mini',
      messages: [{ role: 'user', content: input }],
    });

    console.log('\n🤖 Response:', chat.choices[0].message.content, '\n');
  } catch (error) {
    console.error('❌ Error:', error);
  }

  rl.prompt();
});

rl.on('close', () => {
  console.log('\n', '👋 Goodbye!');
  process.exit(0);
});