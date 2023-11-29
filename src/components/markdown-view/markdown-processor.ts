import { Find, Replace, findAndReplace, ReplaceFunction } from 'mdast-util-find-and-replace';
import { Plugin } from 'unified'
import { PhrasingContent } from 'mdast'

const RE_BUBBLE = /{bubble:.+?}/g;
const RE_CATCHALL = /{.+?}/g;

// Creating HTML node in Markdown node is undocumented.
// https://github.com/syntax-tree/mdast-util-math/blob/e70bb824dc70f5423324b31b0b68581cf6698fe8/index.js#L44-L55

export default function plugin(): Plugin {
  function linkBubble(text: string): PhrasingContent[] {
    console.log('linkBubble', text)
    const [icon, url, value]: string[] = text.split(':')

    return [{
      type: 'html',
      value: value,
      data: {
        hName: 'a',
        hProperties: {
          className: ['link-bubble', `link-bubble-${icon}`],
          href: `https://${url}`,
        },
        hChildren: [
          {
            type: 'text', value: value
          }
        ],
      },
    }];
  }

  function replaceBubble(match: string) {
    return linkBubble(match.replace(/{bubble:(.+?)}/, '$1'))
  }

  const replacers: [Find, Replace][] = [
    [RE_BUBBLE, replaceBubble],
    [RE_CATCHALL, '']
  ];

  function transformer(tree: any) {
    findAndReplace(tree, replacers);
  }

  return transformer;
}