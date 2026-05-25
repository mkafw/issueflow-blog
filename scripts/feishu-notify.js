#!/usr/bin/env node
/**
 * Issueflow-Blog 飞书通知工具
 * 
 * 用法:
 *   node scripts/feishu-notify.js "文章标题" "文章摘要" "文章链接"
 *   node scripts/feishu-notify.js --status success "部署成功"
 *   node scripts/feishu-notify.js --status failure "部署失败"
 */

const https = require('https');

const WEBHOOK_URL = process.env.FEISHU_WEBHOOK_URL || '';

function sendCardMessage(title, elements, template = 'blue') {
  if (!WEBHOOK_URL) {
    console.error('错误: FEISHU_WEBHOOK_URL 未设置');
    process.exit(1);
  }

  const payload = {
    msg_type: 'interactive',
    card: {
      header: {
        title: {
          tag: 'plain_text',
          content: title
        },
        template: template
      },
      elements: elements
    }
  };

  const url = new URL(WEBHOOK_URL);
  const data = JSON.stringify(payload);

  const options = {
    hostname: url.hostname,
    path: url.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(body));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('用法:');
    console.log('  node scripts/feishu-notify.js "标题" "内容" "链接"');
    console.log('  node scripts/feishu-notify.js --status success "消息"');
    console.log('  node scripts/feishu-notify.js --status failure "消息"');
    console.log('  node scripts/feishu-notify.js --new-post "标题" "摘要" "链接"');
    process.exit(0);
  }

  try {
    if (args[0] === '--status') {
      const status = args[1];
      const message = args.slice(2).join(' ');
      
      const template = status === 'success' ? 'green' : 'red';
      const icon = status === 'success' ? '✅' : '❌';
      
      const result = await sendCardMessage(
        `${icon} ${message}`,
        [
          {
            tag: 'div',
            text: {
              tag: 'lark_md',
              content: `**时间**: ${new Date().toLocaleString('zh-CN')}\n**项目**: Issueflow-Blog`
            }
          }
        ],
        template
      );
      console.log('飞书通知发送成功:', result);
      
    } else if (args[0] === '--new-post') {
      const title = args[1];
      const summary = args[2];
      const link = args[3];
      
      const result = await sendCardMessage(
        '📝 新文章发布',
        [
          {
            tag: 'div',
            text: {
              tag: 'lark_md',
              content: `**标题**: ${title}\n**摘要**: ${summary}\n\n点击查看详情 →`
            }
          },
          {
            tag: 'action',
            actions: [
              {
                tag: 'button',
                text: {
                  tag: 'plain_text',
                  content: '阅读文章'
                },
                url: link,
                type: 'primary'
              }
            ]
          }
        ],
        'blue'
      );
      console.log('飞书通知发送成功:', result);
      
    } else {
      // 默认模式：标题 + 内容 + 链接
      const title = args[0];
      const content = args[1] || '';
      const link = args[2] || '';
      
      const elements = [
        {
          tag: 'div',
          text: {
            tag: 'lark_md',
            content: content ? `**内容**:\n${content}` : ''
          }
        }
      ];
      
      if (link) {
        elements.push({
          tag: 'action',
          actions: [
            {
              tag: 'button',
              text: {
                tag: 'plain_text',
                content: '查看'
              },
              url: link,
              type: 'primary'
            }
          ]
        });
      }
      
      const result = await sendCardMessage(title, elements);
      console.log('飞书通知发送成功:', result);
    }
  } catch (error) {
    console.error('发送飞书通知失败:', error.message);
    process.exit(1);
  }
}

main();
