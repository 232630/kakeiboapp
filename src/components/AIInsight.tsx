import { useState, useRef, useEffect } from 'react';
import { Transaction } from '../types';

interface Props {
  transactions: Transaction[];
  month: string;
}

interface Message {
  role: 'user' | 'ai';
  content: string;
}

const QUICK = [
  '今月の支出を分析して',
  '節約できる箇所を教えて',
  '来月の予算計画を立てて',
  '資産を増やすアドバイスが欲しい',
];

export function AIInsight({ transactions, month }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function send(question: string) {
    if (!question.trim() || loading) return;
    setMessages(prev => [...prev, { role: 'user', content: question }]);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions, question, month }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `Error ${res.status}`);
      setMessages(prev => [...prev, { role: 'ai', content: data.advice }]);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'エラーが発生しました';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass-card ai-chat-card">
      <div className="card-header">
        <div className="card-title-group">
          <span className="card-icon">✦</span>
          <h2>Savvo AI アドバイザー</h2>
        </div>
        <span className="badge-ai">Claude AI</span>
      </div>
      <p className="card-desc">あなたの家計データをClaudeが分析します。何でも聞いてください。</p>

      <div className="quick-btns">
        {QUICK.map(q => (
          <button key={q} className="quick-btn" onClick={() => send(q)} disabled={loading}>
            {q}
          </button>
        ))}
      </div>

      <div className="chat-body">
        {messages.length === 0 && !loading && (
          <div className="chat-empty">
            <span className="chat-empty-icon">✦</span>
            <p>上のボタンか、入力欄から質問してください</p>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`chat-msg ${m.role}`}>
            {m.role === 'ai' && <span className="msg-avatar">✦</span>}
            <div className="msg-bubble">
              {m.content.split('\n').map((line, j) => (
                <p key={j}>{line || ' '}</p>
              ))}
            </div>
          </div>
        ))}

        {loading && (
          <div className="chat-msg ai">
            <span className="msg-avatar">✦</span>
            <div className="msg-bubble">
              <div className="typing">
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="chat-error">
            ⚠ {error}
            {error.includes('APIキー') && (
              <span className="error-hint">
                → Vercel の環境変数に <code>ANTHROPIC_API_KEY</code> を設定してください
              </span>
            )}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="chat-footer">
        <input
          className="chat-input"
          placeholder="家計について何でも..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
          disabled={loading}
        />
        <button
          className="chat-send"
          onClick={() => send(input)}
          disabled={loading || !input.trim()}
        >
          送信
        </button>
      </div>
    </div>
  );
}
