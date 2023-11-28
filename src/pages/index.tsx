import { ReactElement } from "react"

import { NextPageWithLayout } from '@/pages/_app'
import { Layout } from "@/components/layout"

import { CategoryView, PostView } from "@/components/markdown-view"

const Page: NextPageWithLayout = () => {
  // return (<CategoryView category={['Blog']} />) // TODO: Make this a different index
  return (<PostView path={['index']} />) // TODO: Make this a different index
}

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>{page}</Layout>
  )
}

export default Page
