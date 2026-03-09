export function* fromStringGenerator(args: string[]): Generator<string> {
    for (const arg of args) {
        yield arg;
    }
}