import { Find, Replace, findAndReplace, ReplaceFunction } from 'mdast-util-find-and-replace';
import { Plugin } from 'unified'
import { PhrasingContent } from 'mdast'

const RE_BUBBLE = '{bubble::(.+?)}'
const RE_CATCHALL = '{.+?}'

// Creating HTML node in Markdown node is undocumented.
// https://github.com/syntax-tree/mdast-util-math/blob/e70bb824dc70f5423324b31b0b68581cf6698fe8/index.js#L44-L55

export default function plugin(): Plugin {
  function linkBigBubble(text: string): PhrasingContent[] {
    console.log('linkBigBubble', text)
    const [size, icon, url, what]: string[] = text.split('::')

    return [{
      type: 'html',
      value: '',
      data: {
        hName: 'a',
        hProperties: {
          className: [`link-${size}-bubble`, `link-${size}-bubble-${icon}`],
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
              type: 'text', value: what
            }],
          }, {
            type: 'element', 
            tagName: 'div',
            properties: { className: ['where'] },
            children: [{
              type: 'text', value: icon.replaceAll('-', ' ')
            }],
          }],
        }],
      },
    }];
  }

  function replaceBigBubble(match: string) {
    console.log('replaceBigBubble', match)
    return linkBigBubble(match.replace(RegExp(RE_BUBBLE, 'g'), '$1'))
  }

  const replacers: [Find, Replace][] = [
    [RegExp(RE_BUBBLE, 'g'), replaceBigBubble],
    [RegExp(RE_CATCHALL, 'g'), '']
  ];

  function transformer(tree: any) {
    findAndReplace(tree, replacers);
  }

  return transformer;
}