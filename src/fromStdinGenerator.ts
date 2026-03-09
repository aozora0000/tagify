export async function* fromStdinGenerator(stream: ReadableStream): AsyncGenerator<string> {
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let remaining = "";

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }

            const chunk = decoder.decode(value, { stream: true });
            const lines = (remaining + chunk).split(/\r?\n/);
            remaining = lines.pop() ?? "";

            for (const line of lines) {
                if (line) yield line;
            }
        }
        if (remaining) yield remaining;
    } finally {
        reader.releaseLock();
    }
}