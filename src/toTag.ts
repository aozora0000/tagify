export const toTag = (val: string): string => {
    if(/^[a-zA-Z]+:\/\//.test(val)) {
        try {
            const parsed = new URL(val);
            // ドメインを除いた部分（パス + クエリ + ハッシュ）を取得
            // 先頭の / は削除
            const rawPath = (parsed.pathname + parsed.search + parsed.hash).replace(/^\//, "");

            // パスが空（ドメインのみ）の場合はホスト名を使用
            const target = rawPath || parsed.hostname;

            // 記号 (?, &, /, =, #) をハイフンに置換し、連続するハイフンをまとめる
            return target
                .replace(/[\/\?\& \=\#]/g, "-")
                .replace(/-+/g, "-")
                .replace(/-$/, "");
        } catch {
            // パース失敗時はプロトコル部分だけ削って記号置換
            return val.replace(/^[a-zA-Z]+:\/\//, "").replace(/[\/\?\& \=\#]/g, "-");
        }
    }
    return val
        .trim()
        .replace(/[\/\?\& \=\#]/g, "-")
        .replace(/-+/g, "-");
}
