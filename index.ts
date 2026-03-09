import { existsSync } from "node:fs";
import { match, P } from "ts-pattern";
import {fromStdinGenerator} from "./src/fromStdinGenerator.ts";
import {toTag} from "./src/toTag.ts";
import {fromStringGenerator} from "./src/fromStringGenerator.ts";

// --- 実行 ---
const args = Bun.argv.slice(2);

const firstArg = args[0];
const hasArgs = args.length > 0;
const isFile = !!firstArg && existsSync(firstArg);

const lines = match({ hasArgs, isFile })
    // 1. 引数があり、かつファイルが存在する場合
    .with({ hasArgs: true, isFile: true }, () =>
        fromStdinGenerator(Bun.file(firstArg!).stream())
    )
    // 2. 引数があり、ファイルではない場合 (文字列リストとして処理)
    .with({ hasArgs: true, isFile: false },  () =>
        fromStringGenerator(args)
    )
    // 3. 引数が全くない場合、または明示的に標準入力を優先する場合
    // パイプ入力中（!isTerminal）でも、ターミナル待機中でも、標準入力をストリーム処理する
    .otherwise(() =>
        fromStdinGenerator(Bun.stdin.stream())
    );

for await (const item of lines) {
    console.log(toTag(item));
}