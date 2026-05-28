'use client';

import { useState, type FormEvent } from 'react';

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');

    const form = e.currentTarget;
    const data = new FormData(form);
    const body = JSON.stringify({
      name: data.get('name'),
      email: data.get('email'),
      message: data.get('message'),
    });

    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
      if (!res.ok) throw new Error();
      setStatus('ok');
      form.reset();
    } catch {
      setStatus('err');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm text-cosmic-text-secondary mb-1">称呼</label>
        <input
          id="name" name="name" type="text" required
          className="w-full px-4 py-2.5 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] text-cosmic-text placeholder:text-cosmic-text-muted focus:outline-none focus:border-[var(--accent-gold)] transition-colors"
          placeholder="你的名字"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm text-cosmic-text-secondary mb-1">邮箱</label>
        <input
          id="email" name="email" type="email" required
          className="w-full px-4 py-2.5 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] text-cosmic-text placeholder:text-cosmic-text-muted focus:outline-none focus:border-[var(--accent-gold)] transition-colors"
          placeholder="your@email.com"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm text-cosmic-text-secondary mb-1">留言</label>
        <textarea
          id="message" name="message" rows={5} required
          className="w-full px-4 py-2.5 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] text-cosmic-text placeholder:text-cosmic-text-muted focus:outline-none focus:border-[var(--accent-gold)] transition-colors resize-y"
          placeholder="说点什么..."
        />
      </div>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="px-6 py-2.5 rounded-lg font-medium text-sm transition-all"
        style={{
          background: 'var(--accent-gold)',
          color: '#000',
          opacity: status === 'sending' ? 0.6 : 1,
        }}
      >
        {status === 'sending' ? '发送中...' : status === 'ok' ? '已发送 ✓' : status === 'err' ? '发送失败，点此重试' : '发送'}
      </button>
    </form>
  );
}
