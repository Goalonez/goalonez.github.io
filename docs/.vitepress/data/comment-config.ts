export const giscusConfig = {
  siteOrigin: 'https://blog.goalonez.site',
  repo: 'Goalonez/goalonez.github.io',
  repoId: 'R_kgDOKNMytQ',
  category: 'Announcements',
  categoryId: 'DIC_kwDOKNMytc4C3_GX',
  mapping: 'pathname',
  strict: '1',
  reactionsEnabled: '1',
  emitMetadata: '0',
  inputPosition: 'top',
  lang: 'zh-CN',
  loading: 'lazy',
} as const

export function toHumanReadablePath(path: string): string {
  const normalized = normalizeCommentPath(path)

  try {
    return decodeURI(normalized).replaceAll(' ', '%20')
  } catch {
    return normalized
  }
}

export function getCommentBacklink(path: string): string {
  return `${giscusConfig.siteOrigin}${toHumanReadablePath(path)}`
}

export function normalizeCommentPath(path: string): string {
  if (!path) {
    return '/'
  }

  const normalized = path.startsWith('/') ? path : `/${path}`

  try {
    return encodeURI(decodeURI(normalized))
  } catch {
    return encodeURI(normalized)
  }
}

export function getGiscusTheme(isDark: boolean): 'light' | 'dark' {
  return isDark ? 'dark' : 'light'
}
