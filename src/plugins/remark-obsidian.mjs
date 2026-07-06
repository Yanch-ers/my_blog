/**
 * remark plugin to handle Obsidian-specific Markdown syntax
 *
 * Handles:
 * 1. Callout blocks: > [!info] ... > [!warning] ... etc.
 * 2. Wikilinks: [[Some Note]] -> plain text (unresolved links)
 * 3. Dataview code blocks: stripped out
 * 4. Obsidian-specific frontmatter fields: ignored gracefully (handled by schema)
 */

/** @type {import('unified').Plugin} */
export function remarkObsidian() {
  return (tree) => {
    visit(tree);
  };
}

function visit(node) {
  if (!node || typeof node !== 'object') return;

  if (node.children && Array.isArray(node.children)) {
    const newChildren = [];
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];

      // Remove dataview code blocks
      if (child.type === 'code' && child.lang === 'dataview') {
        continue; // skip
      }

      // Transform callout blockquotes
      if (child.type === 'blockquote') {
        transformCallout(child);
      }

      // Recurse
      visit(child);
      newChildren.push(child);
    }
    node.children = newChildren;
  }

  // Transform wikilinks in text nodes: [[Target]] or [[Target|Label]]
  if (node.type === 'text' && node.value) {
    node.value = node.value.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, target, label) => {
      return label || target;
    });
  }
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

  // Map callout type to display label
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

  // Replace the first text with a formatted label
  firstText.value = `${displayTitle}\n${firstText.value.replace(/^\[![\w-]+\](?:\s+.+)?/, '').trimStart()}`;

  // Add data attribute to blockquote
  blockquote.data = blockquote.data || {};
  blockquote.data.hProperties = {
    ...blockquote.data?.hProperties,
    'data-callout': calloutType,
    className: [`callout`, `callout-${calloutType}`],
  };
}
