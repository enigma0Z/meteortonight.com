import { useEffect, useState } from "react"
import { ReactElement } from "react"

import { useRouter } from "next/router"

import { NextPageWithLayout } from '@/pages/_app'
import { Layout } from "@/components/layout"

import { CategoryView } from "@/components/markdown-view"
import { Stats } from "fs"
import { MetaTags } from "@enigma0z/brand-resources"
import Head from "next/head"

type Query = {
  category: string[]
}

type SidebarItem = {
  name: string,
  href: string
}

type Metadata = {
  sidebar: SidebarItem[]
}

export const Page: NextPageWithLayout = () => {
  const { category } = useRouter().query as Query

  return <>
    <Head>
      <meta name="description" content="enigma's pokemon site" />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@enigma_0z" />
      <meta name="twitter:title" content="enigma's pokemon site: View Category" />
    </Head>
    <CategoryView category={category} />
  </>
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
    .filter(file => file.name.endsWith('index.json'))
    .map(file => ({
      params: {
        category: [...file.name.split('.')[0].split('/').slice(2, -1)]
      }
    }))
    .filter(param => param.params.category.length > 0)

  console.log(paths)

  return {
    paths: paths,
    fallback: false
  }
}

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>{page}</Layout>
  )
}

export default Page