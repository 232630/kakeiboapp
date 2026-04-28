import Anthropic from '@anthropic-ai/sdk';

type Req = { method: string; body: Record<string, unknown> };
type Res = {
  status: (code: number) => Res;
  json: (data: unknown) => void;
};

export default async function handler(req: Req, res: Res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'APIキーが設定されていません (ANTHROPIC_API_KEY)' });
  }

  const { transactions = [], question = '', month = '' } = req.body ?? {};
  const txs = transactions as { type: string; amount: number; category: string; date: string }[];

  const income = txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const catMap: Record<string, number> = {};
  for (const t of txs.filter(t => t.type === 'expense')) {
    catMap[t.category] = (catMap[t.category] ?? 0) + t.amount;
  }
  const catText = Object.entries(catMap)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `  ${k}: ¥${v.toLocaleString('ja-JP')}`)
    .join('\n');

  const client = new Anthropic({ apiKey });

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    system: `あなたはAI家計管理アドバイザー「Savvo AI」です。
ユーザーの家計データを元に、具体的で実用的なアドバイスを日本語で提供してください。
・絵文字を適度に使い、読みやすくする
・箇条書きや改行で整理する
・数字を引用して具体的に指摘する
・前向きで励ましのあるトーンで`,
    messages: [{
      role: 'user',
      content: `【家計データ（${month}）】
収入合計: ¥${income.toLocaleString('ja-JP')}
支出合計: ¥${expense.toLocaleString('ja-JP')}
残高: ¥${(income - expense).toLocaleString('ja-JP')}
取引件数: ${txs.length}件

カテゴリ別支出:
${catText || '  データなし'}

【質問】
${question || '家計の状況を分析して、改善アドバイスを3点教えてください'}`,
    }],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';
  res.json({ advice: text });
}
