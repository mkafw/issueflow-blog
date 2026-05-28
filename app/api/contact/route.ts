import { NextResponse, type NextRequest } from 'next/server';

const WEBHOOK_URL = process.env.FEISHU_WEBHOOK_URL ?? '';

export async function POST(req: NextRequest) {
  try {
    const { name, email, message }: { name: string; email: string; message: string } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: '缺少必填字段' }, { status: 400 });
    }

    // Send to Feishu webhook
    if (WEBHOOK_URL) {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          msg_type: 'interactive',
          card: {
            header: { title: { tag: 'plain_text', content: `📬 来自 ${name}` }, template: 'blue' },
            elements: [
              { tag: 'div', text: { tag: 'lark_md', content: `**邮箱**: ${email}\n\n**留言**:\n${message}` } },
            ],
          },
        }),
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: '服务器错误' }, { status: 500 });
  }
}
