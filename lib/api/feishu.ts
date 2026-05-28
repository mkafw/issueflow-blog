import { request } from '@/lib/api/client';
import { logger } from '@/lib/logger';

interface FeishuCardHeader {
  title: string;
  template?: 'blue' | 'green' | 'red';
}

interface FeishuCard {
  header: FeishuCardHeader;
  elements: unknown[];
}

export async function sendCard(webhookUrl: string, card: FeishuCard) {
  try {
    await request(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ msg_type: 'interactive', card }),
    });
  } catch (err) {
    logger.error('feishu webhook failed', { error: String(err) });
  }
}

export function successCard(title: string, content: string, link?: string): FeishuCard {
  const elements: unknown[] = [
    { tag: 'div', text: { tag: 'lark_md', content } },
  ];
  if (link) {
    elements.push({
      tag: 'action',
      actions: [
        { tag: 'button', text: { tag: 'plain_text', content: '查看' }, url: link, type: 'primary' },
      ],
    });
  }
  return { header: { title: `✅ ${title}`, template: 'green' }, elements };
}

export function errorCard(title: string, content: string): FeishuCard {
  return {
    header: { title: `❌ ${title}`, template: 'red' },
    elements: [{ tag: 'div', text: { tag: 'lark_md', content } }],
  };
}
