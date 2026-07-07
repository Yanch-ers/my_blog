/**
 * remark plugin to handle Obsidian-specific Markdown syntax
 */

import { buildTitleUrlMap } from '../lib/title-url-map.ts';

let titleUrlMap = null;

function getTitleUrlMap() {
  titleUrlMap = buildTitleUrlMap();
  return titleUrlMap;
}

/** @type {import('unified').Plugin} */
export function remarkObsidian() {
  return (tree) => {
    visit(tree);
  };
}

function visit(node) {
  if (!node || typeof node !== 'object') return;

  if (node.children && Array.isArray(node.children)) {
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];

      if (child.type === 'code' && child.lang === 'dataview') {
        node.children.splice(i, 1);
        i--;
        continue;
      }

      if (child.type === 'blockquote') {
        transformCallout(child);
      }

      if (child.type === 'text' && child.value && child.value.includes('[[')) {
        const transformed = transformWikilinks(child.value);
        if (transformed !== child.value) {
          const newNodes = parseMarkdownInline(transformed);
          node.children.splice(i, 1, ...newNodes);
          i += newNodes.length - 1;
          continue;
        }
      }

      visit(child);
    }
  }
}

function transformWikilinks(text) {
  const map = getTitleUrlMap();
  return text.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (match, target, label) => {
    const entry = map.get(target.toLowerCase());
    
    if (entry) {
      const displayText = label || target;
      return `[${displayText}](${entry.url})`;
    }
    
    return label || target;
  });
}

function parseMarkdownInline(text) {
  const nodes = [];
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match;
  
  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push({
        type: 'text',
        value: text.slice(lastIndex, match.index),
      });
    }
    
    nodes.push({
      type: 'link',
      url: match[2],
      children: [{
        type: 'text',
        value: match[1],
      }],
      data: {
        hProperties: {
          class: 'internal-link',
        },
      },
    });
    
    lastIndex = linkRegex.lastIndex;
  }
  
  if (lastIndex < text.length) {
    nodes.push({
      type: 'text',
      value: text.slice(lastIndex),
    });
  }
  
  return nodes.length > 0 ? nodes : [{ type: 'text', value: text }];
}

/**
 * Transform Obsidian callout:
 * > [!info] Title
 * > content
 *
 * into a blockquote with data attributes (rendered via CSS)
 */
function transformCallout(blockquote) {
  if (!blockquote.children || blockquote.children.length === 0) return;
  const firstParagraph = blockquote.children[0];
  if (firstParagraph?.type !== 'paragraph') return;
  const firstText = firstParagraph.children?.[0];
  if (firstText?.type !== 'text') return;

  const calloutMatch = firstText.value.match(/^\[!([\w-]+)\](?:\s+(.+))?/);
  if (!calloutMatch) return;

  const calloutType = calloutMatch[1].toLowerCase();
  const calloutTitle = calloutMatch[2] || calloutType;

  const typeMap = {
    info: 'ℹ 提示',
    note: '📝 注意',
    tip: '💡 技巧',
    warning: '⚠ 警告',
    caution: '⚠ 注意',
    danger: '🔥 危险',
    success: '✅ 成功',
    question: '❓ 问题',
    quote: '💬 引用',
    example: '📋 示例',
    abstract: '📌 摘要',
    summary: '📌 摘要',
    todo: '☑ 待办',
    bug: '🐛 Bug',
    important: '❗ 重要',
  };

  const label = typeMap[calloutType] || calloutType;
  const displayTitle = calloutTitle !== calloutType ? calloutTitle : label;

  firstText.value = `${displayTitle}\n${firstText.value.replace(/^\[![\w-]+\](?:\s+.+)?/, '').trimStart()}`;

  blockquote.data = blockquote.data || {};
  blockquote.data.hProperties = {
    ...blockquote.data?.hProperties,
    'data-callout': calloutType,
    className: [`callout`, `callout-${calloutType}`],
  };

  traverseAndReplaceWikilinks(blockquote);
}

function traverseAndReplaceWikilinks(node) {
  if (!node || typeof node !== 'object') return;

  if (node.children && Array.isArray(node.children)) {
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];

      if (child.type === 'text' && child.value && child.value.includes('[[')) {
        const transformed = transformWikilinks(child.value);
        if (transformed !== child.value) {
          const newNodes = parseMarkdownInline(transformed);
          node.children.splice(i, 1, ...newNodes);
          i += newNodes.length - 1;
          continue;
        }
      }

      traverseAndReplaceWikilinks(child);
    }
  }
}