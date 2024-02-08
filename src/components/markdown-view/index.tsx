import useFetch, { useFetchObj } from "@/hooks/useFetch"
import { BASE_PATH, ContentIndex, ContentIndexItem } from "@/types/content"
import { useEffect, useState } from "react"

import css from './index.module.css'
import { Box, Typography } from "@mui/material"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { NextLink } from "../NextLink"
import Head from "next/head"
import markdownProcessor from "./markdown-processor"

type SidebarItem = {
  name: string,
  href: string
}

const MAX_ARTICLES = 5

function capitalize(string: string) {
  return string.replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase())
}

type ContentMarkdownProps = {
  mtime?: number,
  path?: string[],
  uri?: string,
  header?: boolean,
  children: string,
}

function ContentBreadcrumb({ path }: { path: string[] }) {
  return (<>{
    path.map((item, index) => (
      <>
        <NextLink
          key={item}
          href={[
            '', 'content', 'view', 'category', ...path.slice(0, index + 1)
          ].join('/')}
          sx={{
            textTransform: 'capitalize'
          }}
        >
          {item.replace('-', ' ')}
        </NextLink>{index + 1 === path.length ? '' : ' / '}
      </>
    ))
  }</>)
}

function ContentMarkdown({ mtime, path, uri, header, children }: ContentMarkdownProps) {
  let metadata = <></>
  if (header && mtime !== undefined && path !== undefined && uri !== undefined) {
    metadata = <Box className={`${css.MarkdownHeader}`}>
      <Typography flex={'100%'} variant="caption">
        Last updated {new Date(mtime).toDateString()}, Filed
        under <ContentBreadcrumb path={path} />
      </Typography>
      <Typography flex={1} textAlign={'right'} variant="caption">
        <NextLink href={uri}>permalink</NextLink>
      </Typography>
    </Box>
  }
  return (<Box className={css.MarkdownContainer} width={'100%'}>
    {metadata}
    <ReactMarkdown
      className={css.MarkdownContent}
      components={{
        h1: ({node, ...props}) => {
          //@ts-ignore children[0] of an h1 is a text node
          return <h1 {...props} ><NextLink href={uri}>{node.children[0].value}</NextLink></h1>
        },
        h2: ({ node, ...props }) => {
          //@ts-ignore children[0] of an h2 is a text node
          const name = node.children[0].value
          const id = name.replaceAll(' ', '-')
          return <h2 id={`${id}`} {...props} />
        },
        a: ({ node, ...props }) => {
          if (props.href?.startsWith('http')) {
            props.target = '_blank'
          }

          return <NextLink href={props.href ?? ''} {...props} />
        },
        img: ({node, ...props}) => {
          return <a href={props.src ?? ''}><img {...props}/></a>
        }
      }}
      remarkPlugins={[markdownProcessor, remarkGfm]}
    >
      {children}
    </ReactMarkdown>
  </Box>)
}

export function getUriPathFromContent(content: ContentIndexItem) {
  return ['', 'content', 'view', 'post', ...content.path, content.file].join('/')
}

export function CategoryView({ category }: { category: string[] }) {
  const [pageContent, setPageContent] = useState([] as JSX.Element[])

  const fetchContent = useFetchObj<ContentIndex>()

  const doFetchContent = async (displayedContent: ContentIndex) => {
    const newPageContent = []
    try {
      console.log('fetching content', displayedContent)
      for (const content of displayedContent) {
        if (content.path.length === 0 || content.path[0] === 'test') continue;

        const uri = getUriPathFromContent(content)
        const contentPath: string[] = [BASE_PATH]

        if (content.path.length > 0) {
          contentPath.push(...content.path)
        }

        contentPath.push(content.file + '.md')

        const result = await fetch(contentPath.join('/'))
        if (!result.ok) throw new Error('Response was not ok')
        let markdownContent = await result.text()

        newPageContent.push(
          <ContentMarkdown header={true} key={uri} uri={uri} mtime={content.mtime} path={content.path}>
            {markdownContent}
          </ContentMarkdown>
        )
      }

    } catch (ex) {
      newPageContent.push(<ContentMarkdown key='oops'>
        Oops!! Looks like we can&apos;t find the content for this page. Try
        going back or selecting a different page.
      </ContentMarkdown>)
    } finally {
      setPageContent(newPageContent)
    }
  }

  // Process data from fetched response
  useEffect(() => {
    if (fetchContent.data) {
      console.log('fetched response processing')
      const numArticles = fetchContent.data.length > MAX_ARTICLES ? MAX_ARTICLES : fetchContent.data.length
      const displayedContent = fetchContent.data.sort((a, b) => a.mtime < b.mtime ? 1 : -1).slice(0, numArticles)
      doFetchContent(displayedContent)
    }
  }, [fetchContent.data])

  useEffect(() => {
    const jsonPath = [BASE_PATH]
    if (category) jsonPath.push(...category)
    jsonPath.push('index.json')

    const fetchPath = jsonPath.join('/').toLowerCase()

    fetchContent.setUrl(fetchPath)
  }, [category])

  return (<>
    <Head>
      <title>{"Meteor Tonight" + category !== undefined && category.length > 0 ? ' - ' + capitalize(category.join(' / ')) : ''}</title>
    </Head>
    <Box display={'flex'} flexDirection='column'>
      <Box width={'100%'}>
        {pageContent}
      </Box>
    </Box>
  </>)
}

function contentUrl(path: string[]) {
  return [BASE_PATH, path.join('/')].join('/') + '.md'
}

function metadataUrl(path: string[]) {
  return [BASE_PATH, path.join('/')].join('/') + '.md.json'
}

export function PostView(
  { path, usePostTitle = true, header = undefined }: 
  { path: string[], usePostTitle?: boolean, header?: boolean }
) {
  const [content, setContent] = useState<JSX.Element[]>([])
  const [title, setTitle] = useState(null as null | string)

  const fetchContent = useFetchObj<string>()
  const fetchMetadata = useFetchObj<ContentIndexItem>()

  useEffect(() => {
    if (fetchContent.data && fetchMetadata.data) {
      const newContent = []
      newContent.push(
        <ContentMarkdown {...fetchMetadata.data} 
          header={header === undefined ? fetchMetadata.data.header : header } 
          uri={path.join('/')}
        >
          {fetchContent.data}
        </ContentMarkdown>
      )
      if (usePostTitle) {
        setTitle(fetchMetadata.data.title ?? 'Meteor Tonight')
      }

      /**
       * Extract sub-content links from content
       * Store sub-content links in state
       * Set sub-content index to 0
       */
      if (fetchContent.data){
        for (const line of fetchContent.data.split('\n')) {
          const match = line.match(/{meta:sub-content:(?<path>.+?)}/)
          if (match && match.groups) {
            newContent.push(
              <PostView header={false} path={match.groups.path.split('/')} usePostTitle={false}
            />)
          }
        }
      }

      setContent(newContent)
    }
  }, [fetchContent.data, fetchMetadata.data])

  useEffect(() => {
    fetchContent.setUrl(contentUrl(path))
    fetchMetadata.setUrl(metadataUrl(path))
  }, [path])

  return (<>
    {title ? <Head>
      <title>{capitalize(title)}</title>
    </Head> : ''}
    <Box display={'flex'} flexDirection='column' width={'100%'}>
      {content}
    </Box>
  </>)
}