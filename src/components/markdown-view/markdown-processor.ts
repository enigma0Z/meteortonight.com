import { Find, Replace, findAndReplace } from 'mdast-util-find-and-replace';
import PokeAPI from 'pokedex-promise-v2';
import { Plugin } from 'unified'

const RE_BUBBLE = /{bubble:.+?}/g;

// Creating HTML node in Markdown node is undocumented.
// https://github.com/syntax-tree/mdast-util-math/blob/e70bb824dc70f5423324b31b0b68581cf6698fe8/index.js#L44-L55

export default function plugin(): Plugin {
  function linkBubble(text: string): any {
    return {
      type: 'text',
      meta: null,
      value: text,
      data: {
        hName: 'span',
        hProperties: {
          className: ['link-bubble'],
        },
        hChildren: [{ type: 'text', value: text }],
      },
    };
  }

  function replaceBubble(match: string) {
    return linkBubble(match.replace(/{type:(\w+?)}/, '$1'))
  }

  const replacers: [Find, Replace][] = [
    [RE_BUBBLE, replaceBubble],
  ];

  function transformer(tree: any) {
    findAndReplace(tree, replacers);
  }

  return transformer;
}