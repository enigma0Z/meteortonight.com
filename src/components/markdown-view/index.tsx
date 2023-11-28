import useFetch from "@/hooks/useFetch"
import { BASE_PATH, ContentIndex, ContentIndexItem } from "@/types/content"
import { useEffect, useState } from "react"

import css from './index.module.css'
import { Box, List, ListItem, Typography } from "@mui/material"
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
  children: string,
}

function ContentBreadcrumb({ path }: { path: string[] }) {
  console.log('ContentBreadcrumb()', path)
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

function ContentMarkdown({ mtime, path, uri, children }: ContentMarkdownProps) {
  let metadata = <></>
  if (mtime !== undefined && path !== undefined && uri !== undefined) {
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
      }}
      remarkPlugins={[remarkGfm, markdownProcessor]}
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
  const jsonPath = [BASE_PATH]
  console.log('category', category)
  if (category) jsonPath.push(...category)
  jsonPath.push('index.json')

  const [ data, loading, error ] = useFetch<ContentIndex>(jsonPath.join('/').toLowerCase())

  const fetchContent = async (displayedContent: ContentIndex) => {
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
          <ContentMarkdown key={uri} uri={uri} mtime={content.mtime} path={content.path}>
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
    if (data) {
      console.log('fetched response processing')
      const numArticles = data.length > MAX_ARTICLES ? MAX_ARTICLES : data.length
      const displayedContent = data.sort((a, b) => a.mtime < b.mtime ? 1 : -1).slice(0, numArticles)
      fetchContent(displayedContent)
    }
  }, [data])

  return (<>
    <Head>
      <title>{"Meteor Tonight" + category !== undefined && category.length > 0 ? ' - ' + capitalize(category.join(' / ')) : ''}</title>
    </Head>
    <Box display={'flex'} flexDirection='row'>
      <Box width={'100%'}>
        {pageContent}
      </Box>
    </Box>
  </>)
}

export function PostView({ path }: { path: string[] }) {
  const [content, setContent] = useState(<></>)
  const [sidebar, setSidebar] = useState([] as SidebarItem[])
  const [title, setTitle] = useState(null as null | string)

  const [fetchContent] = useFetch<string>([BASE_PATH, path.join('/')].join('/') + '.md')
  const [fetchMetadata] = useFetch<ContentIndexItem>([BASE_PATH, path.join('/')].join('/') + '.md.json')

  useEffect(() => {
    if (fetchContent && fetchMetadata) {
      setContent(<ContentMarkdown {...fetchMetadata} uri={path.join('/')}>
        {fetchContent}
      </ContentMarkdown>)
      setSidebar(
        fetchContent
          .split('\n')
          .filter(line => line.startsWith('## '))
          .map(line => line.split(' ').slice(1).join(' '))
          .map(line => ({ name: line, href: `#${line.replaceAll(' ', '-')}` }))
      )
      setTitle(fetchContent.split('\n')[0].split(' ').slice(1).join(' '))
    }
  }, [path, fetchContent, fetchMetadata])

  let sidebarContent = <></>

  if (sidebar.length > 10) {
    sidebarContent = <Box width={200}>
      <List className={css.MarkdownContent}>
        {sidebar.map(item => <ListItem key={item.href}>
          <a href={item.href}>{item.name}</a>
        </ListItem>)}
      </List>
    </Box>
  }

  return (<>
    {title ? <Head>
      <title>{capitalize(title)}</title>
    </Head> : ''}
    <Box display={'flex'} flexDirection='row' width={'100%'}>
      {sidebarContent}
      {content}
    </Box>
  </>)
}