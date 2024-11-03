import { NextRequest } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com/beta',
  apiKey: process.env.DEEP_SEEK,
});

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  try {
    const stream = await openai.chat.completions.create({
      model: 'deepseek-coder',
      messages: [
        { role: "system", content: "Remove credits, links, promotions (like Read more, related articles), paraphrase texts in p tags, and return only clean html" },
        { role: 'user', content: message },
        //@ts-ignore
        { role: "assistant", content: "```html\n", prefix: true }
      ],
      stream: true,
      stop: ["```"],
    });

    const encoder = new TextEncoder();

    let controller: ReadableStreamDefaultController;
    const responseStream = new ReadableStream({
      start(c) {
        controller = c;
      },
      async pull(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || '';
          controller.enqueue(encoder.encode(content));
          
          // Check if the request has been aborted
          if (req.signal.aborted) {
            controller.close();
            return;
          }
        }
        controller.close();
      },
      cancel() {
        // Clean up any resources if needed
        stream.controller.abort();
      }
    });

    return new Response(responseStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Error fetching OpenAI completion:', error);
    return new Response('Error occurred while fetching OpenAI completion', {
      status: 500,
    });
  }
}