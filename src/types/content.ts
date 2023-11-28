export const BASE_PATH = '/md'

export type ContentIndexItem = {
  category: string,
  path: string[],
  file: string,
  title: string,
  description: string,
  mtime: number
}

export type ContentIndex = ContentIndexItem[]