import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { fromStdinGenerator } from './fromStdinGenerator';

describe('fromStdinGenerator', () => {
  // モックストリームのユーティリティ関数
  function createMockStream(chunks: string[]): ReadableStream {
    const queue: string[] = chunks;
    let controller: ReadableStreamDefaultController | null = null;

    const stream = new ReadableStream({
      start(c) {
        controller = c;
      },
      pull() {
        if (queue.length > 0) {
          controller?.enqueue(queue.shift()!);
        } else {
          controller?.close();
        }
      }
    });

    return stream;
  }

  it('should yield lines from stream', async () => {
    const stream = createMockStream(['line1\nline2', 'line3']);
    const generator = fromStdinGenerator(stream);

    const results: string[] = [];
    for await (const line of generator) {
      results.push(line);
    }

    expect(results).toEqual(['line1', 'line2', 'line3']);
  });

  it('should handle trailing partial line', async () => {
    const stream = createMockStream(['line1\nline2', 'line3\nline4']);
    const generator = fromStdinGenerator(stream);

    const results: string[] = [];
    for await (const line of generator) {
      results.push(line);
    }

    expect(results).toEqual(['line1', 'line2', 'line3', 'line4']);
  });

  it('should handle empty stream', async () => {
    const stream = createMockStream([]);
    const generator = fromStdinGenerator(stream);

    const results: string[] = [];
    for await (const line of generator) {
      results.push(line);
    }

    expect(results).toEqual([]);
  });
});