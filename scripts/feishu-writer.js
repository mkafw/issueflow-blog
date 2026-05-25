#!/usr/bin/env node
/**
 * Issueflow-Blog 飞书写作助手
 * 
 * 通过飞书消息接收写作指令，调用 Claude Code 执行
 * 需要配合 DigitalMe 使用
 * 
 * 用法:
 *   node scripts/feishu-writer.js --help
 */

const https = require('https');

// 飞书 Bot 配置（从 DigitalMe 配置读取）
const FEISHU_CONFIG = {
  appId: process.env.FEISHU_APP_ID || 'cli_a952e33923399bcf',
  appSecret: process.env.FEISHU_APP_SECRET || '',
  webhookUrl: process.env.FEISHU_WEBHOOK_URL || ''
};

// 指令解析
const COMMANDS = {
  '写文章': 'create-post',
  '新建文章': 'create-post',
  '发布': 'publish',
  '部署': 'deploy',
  '状态': 'status',
  '帮助': 'help'
};

function parseCommand(message) {
  const text = message.trim();
  
  for (const [keyword, command] of Object.entries(COMMANDS)) {
    if (text.includes(keyword)) {
      return {
        command,
        args: text.replace(keyword, '').trim()
      };
    }
  }
  
  return { command: 'unknown', args: text };
}

function createReplyCard(title, content, actions = []) {
  return {
    msg_type: 'interactive',
    card: {
      header: {
        title: {
          tag: 'plain_text',
          content: title
        },
        template: 'blue'
      },
      elements: [
        {
          tag: 'div',
          text: {
            tag: 'lark_md',
            content: content
          }
        },
        ...(actions.length > 0 ? [{
          tag: 'action',
          actions: actions
        }] : [])
      ]
    }
  };
}

async function sendReply(webhookUrl, card) {
  const url = new URL(webhookUrl);
  const data = JSON.stringify(card);
  
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

async function handleCommand(cmd, args) {
  switch (cmd) {
    case 'create-post':
      return {
        title: '📝 创建新文章',
        content: `收到创建文章指令。\n\n**标题**: ${args || '（未指定）'}\n\n请提供文章标题和内容，我将为您创建新的 Markdown 文件。`,
        actions: [
          {
            tag: 'button',
            text: { tag: 'plain_text', content: '确认创建' },
            type: 'primary'
          }
        ]
      };
      
    case 'publish':
      return {
        title: '🚀 发布文章',
        content: `收到发布指令。\n\n将触发 GitHub Actions 自动构建和部署。\n\n**等待确认**: 是否立即发布？`,
        actions: [
          {
            tag: 'button',
            text: { tag: 'plain_text', content: '确认发布' },
            type: 'primary'
          },
          {
            tag: 'button',
            text: { tag: 'plain_text', content: '取消' },
            type: 'default'
          }
        ]
      };
      
    case 'deploy':
      return {
        title: '🌐 部署项目',
        content: `收到部署指令。\n\n将执行:\n1. 运行测试\n2. 构建生产版本\n3. 部署到 Netlify\n\n**预计时间**: 3-5 分钟`,
        actions: [
          {
            tag: 'button',
            text: { tag: 'plain_text', content: '开始部署' },
            type: 'primary'
          }
        ]
      };
      
    case 'status':
      return {
        title: '📊 项目状态',
        content: `**Issueflow-Blog 状态**\n\n✅ 前端框架: Next.js 15\n✅ 博客功能: 列表/详情/搜索\n✅ CI/CD: GitHub Actions\n✅ 部署: Netlify\n\n📁 仓库: https://github.com/mkafw/issueflow-blog\n🌐 网站: https://issueflow-blog.netlify.app`,
        actions: []
      };
      
    case 'help':
    default:
      return {
        title: '❓ Issueflow-Blog 帮助',
        content: `**可用指令**:\n\n| 指令 | 说明 |\n|------|------|\n| \`写文章 [标题]\` | 创建新文章 |\n| \`发布\` | 发布/部署文章 |\n| \`部署\` | 部署整个项目 |\n| \`状态\` | 查看项目状态 |\n| \`帮助\` | 显示此帮助 |\n\n**示例**:\n- \`写文章 我的第一篇博客\`\n- \`发布\`\n- \`状态\``,
        actions: []
      };
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log('Issueflow-Blog 飞书写作助手');
    console.log('');
    console.log('用法:');
    console.log('  node scripts/feishu-writer.js --message "写文章 标题"');
    console.log('  node scripts/feishu-writer.js --demo');
    console.log('');
    console.log('环境变量:');
    console.log('  FEISHU_WEBHOOK_URL - 飞书机器人 Webhook URL');
    console.log('  FEISHU_APP_ID      - 飞书应用 ID');
    console.log('  FEISHU_APP_SECRET  - 飞书应用 Secret');
    process.exit(0);
  }
  
  // Demo 模式
  if (args.includes('--demo')) {
    console.log('=== 飞书写作助手 Demo ===\n');
    
    const demos = [
      { cmd: 'help', args: '' },
      { cmd: 'status', args: '' },
      { cmd: 'create-post', args: '我的第一篇博客' },
      { cmd: 'deploy', args: '' }
    ];
    
    for (const demo of demos) {
      const reply = await handleCommand(demo.cmd, demo.args);
      console.log(`指令: ${demo.cmd} ${demo.args}`);
      console.log(`回复: ${reply.title}`);
      console.log('');
    }
    
    console.log('Demo 完成。实际使用时需要配置 FEISHU_WEBHOOK_URL。');
    return;
  }
  
  // 解析消息
  const messageArg = args.find(a => !a.startsWith('--'));
  if (!messageArg) {
    console.error('请提供消息内容，或使用 --help 查看用法');
    process.exit(1);
  }
  
  const { command, args: commandArgs } = parseCommand(messageArg);
  const reply = await handleCommand(command, commandArgs);
  
  if (FEISHU_CONFIG.webhookUrl) {
    const result = await sendReply(FEISHU_CONFIG.webhookUrl, reply);
    console.log('飞书回复发送成功:', result);
  } else {
    console.log('=== 飞书回复预览 ===');
    console.log(JSON.stringify(reply, null, 2));
    console.log('\n设置 FEISHU_WEBHOOK_URL 环境变量以发送实际消息');
  }
}

main();
