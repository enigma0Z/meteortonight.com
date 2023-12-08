import { ReactElement } from "react"

import { useRouter } from "next/router"

import { NextPageWithLayout } from '@/pages/_app'
import { Layout } from "@/components/layout"

import { Stats } from "fs"
import { PostView } from "@/components/markdown-view"
import Head from "next/head"

type Query = {
  path: string[]
}

const Page: NextPageWithLayout = () => {
  console.log('/content/view/post')
  const { path } = useRouter().query as Query

  return <>
    <Head>
      <meta name="description" content="enigma's pokemon site" />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@enigma_0z" />
      <meta name="twitter:title" content="enigma's pokemon site: View Post" />
    </Head>
    <PostView path={path} usePostTitle={true} header={true} />
  </>
}

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>{page}</Layout>
  )
}

export async function getStaticProps(context: any) {
  return {
    props: {},
  }
}

export async function getStaticPaths() {
  const fs = await import('fs')
  type ReturnStat = {
    name: string,
    stats: Stats
  }

  const recursiveReaddirSync = (path: string): ReturnStat[] => {
    const returnStats: ReturnStat[] = []
    const dir = fs.readdirSync(path)
    for (const entry of dir) {
      const filename = [path, entry].join('/')
      const stats = fs.lstatSync(filename)
      if (stats.isDirectory()) {
        returnStats.push(...recursiveReaddirSync(filename))
      } else {
        returnStats.push({
          name: filename,
          stats: stats
        })
      }
    }

    return returnStats
  }

  const paths = recursiveReaddirSync('public/md')
    .filter(file => file.name.endsWith('.md'))
    .map(file => ({
      params: {
        path: [...file.name.split('.')[0].split('/').slice(2)]
      }
    }))

  console.log(paths)

  return {
    paths: paths,
    fallback: false
  }
}

export default Page
