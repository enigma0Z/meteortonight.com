import { Find, Replace, findAndReplace, ReplaceFunction } from 'mdast-util-find-and-replace';
import { Plugin } from 'unified'
import { PhrasingContent } from 'mdast'

const RE_BIG_BUBBLE = '{big-bubble:(.+?)}'
const RE_CATCHALL = '{.+?}'

RE_BIG_BUBBLE.toString()

// Creating HTML node in Markdown node is undocumented.
// https://github.com/syntax-tree/mdast-util-math/blob/e70bb824dc70f5423324b31b0b68581cf6698fe8/index.js#L44-L55

export default function plugin(): Plugin {
  function linkBigBubble(text: string): PhrasingContent[] {
    const [icon, url, what, where]: string[] = text.split(':')
    console.log('linkBigBubble', text)

    return [{
      type: 'html',
      value: '',
      data: {
        hName: 'a',
        hProperties: {
          className: ['link-big-bubble', `link-big-bubble-${icon}`],
          href: `https://${url}`,
        },
        hChildren: [{
          type: 'element', 
          tagName: 'div',
          children: [{
            type: 'element', 
            tagName: 'div',
            properties: { className: ['what'] },
            children: [{
              type: 'text', value: what + " @"
            }],
          }, {
            type: 'element', 
            tagName: 'div',
            properties: { className: ['where'] },
            children: [{
              type: 'text', value: where
            }],
          }],
        }],
      },
    }];
  }

  function replaceBigBubble(match: string) {
    return linkBigBubble(match.replace(RegExp(RE_BIG_BUBBLE, 'g'), '$1'))
  }

  const replacers: [Find, Replace][] = [
    [RegExp(RE_BIG_BUBBLE, 'g'), replaceBigBubble],
    [RegExp(RE_CATCHALL, 'g'), '']
  ];

  function transformer(tree: any) {
    findAndReplace(tree, replacers);
  }

  return transformer;
}