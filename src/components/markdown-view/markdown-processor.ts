import { Find, Replace, findAndReplace, ReplaceFunction } from 'mdast-util-find-and-replace';
import { Plugin } from 'unified'
import { PhrasingContent } from 'mdast'

const RE_BUBBLE = '{bubble::(.+?)}'
const RE_YT_EMBED = '{yt-embed::(.+?)}'
const RE_CATCHALL = '{.+?}'

// Creating HTML node in Markdown node is undocumented.
// https://github.com/syntax-tree/mdast-util-math/blob/e70bb824dc70f5423324b31b0b68581cf6698fe8/index.js#L44-L55

export default function plugin(): Plugin {
  function linkBigBubble(text: string): PhrasingContent[] {
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
    return linkBigBubble(match.replace(RegExp(RE_BUBBLE, 'g'), '$1'))
  }

  function ytEmbed(text: string): PhrasingContent[] {
    const [orientation, videoId]: string[] = text.split('::')
    /**
     * <iframe 
     *   width="806" 
     *   height="778" 
     *   src="https://www.youtube.com/embed/9ZRiW9669Y0" 
     *   title="I know you’ve done this. We all have. #guitar #nirvana #comeasyouare" 
     *   frameborder="0" 
     *   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
     *   allowfullscreen></iframe>
     */
    return [{
      type: 'html',
      value: '',
      data: {
        hName: 'iframe',
        hProperties: {
          // style: {display: 'block', marginLeft: 'auto', marginRight: 'auto'},
          src: `https://www.youtube.com/embed/${videoId}`,
          allow: 'autoplay; picture-in-picture; web-share',
          width: orientation === 'vertical' ? 450 : 800,
          height: orientation === 'vertical' ? 800 : 450,
          frameborder: 0,
        }
      }
    }]
  }

  function replaceYtEmbed(match: string) {
    return ytEmbed(match.replace(RegExp(RE_YT_EMBED, 'g'), '$1'))
  }

  const replacers: [Find, Replace][] = [
    [RegExp(RE_BUBBLE, 'g'), replaceBigBubble],
    [RegExp(RE_YT_EMBED, 'g'), replaceYtEmbed],
    [RegExp(RE_CATCHALL, 'g'), '']
  ];

  function transformer(tree: any) {
    findAndReplace(tree, replacers);
  }

  return transformer;
}