<template>
  <div ref="container" class="comment-thread comment-thread--giscus"></div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useData } from 'vitepress'
import { getCommentBacklink, getGiscusTheme, giscusConfig } from '../data/comment-config'

const props = defineProps<{
  commentPath: string
  discussionNumber?: number
  discussionTerm?: string
}>()

const { isDark } = useData()
const container = ref<HTMLDivElement | null>(null)

function clearContainer() {
  if (container.value) {
    container.value.innerHTML = ''
  }
}

function upsertMetaTag(name: string, content: string) {
  if (typeof document === 'undefined' || !content) {
    return
  }

  let element = document.head.querySelector<HTMLMetaElement>(`meta[name='${name}']`)

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute('name', name)
    document.head.appendChild(element)
  }

  element.setAttribute('content', content)
}

function renderGiscus() {
  if (!container.value) {
    return
  }

  clearContainer()
  upsertMetaTag('giscus:backlink', getCommentBacklink(props.commentPath))

  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  script.async = true
  script.crossOrigin = 'anonymous'

  script.setAttribute('data-repo', giscusConfig.repo)
  script.setAttribute('data-repo-id', giscusConfig.repoId)
  script.setAttribute('data-reactions-enabled', giscusConfig.reactionsEnabled)
  script.setAttribute('data-emit-metadata', giscusConfig.emitMetadata)
  script.setAttribute('data-input-position', giscusConfig.inputPosition)
  script.setAttribute('data-theme', getGiscusTheme(isDark.value))
  script.setAttribute('data-lang', giscusConfig.lang)
  script.setAttribute('data-loading', giscusConfig.loading)

  if (props.discussionNumber) {
    script.setAttribute('data-mapping', 'number')
    script.setAttribute('data-term', String(props.discussionNumber))
  } else {
    script.setAttribute('data-category', giscusConfig.category)
    script.setAttribute('data-category-id', giscusConfig.categoryId)
    script.setAttribute('data-strict', giscusConfig.strict)

    if (props.discussionTerm) {
      script.setAttribute('data-mapping', 'specific')
      script.setAttribute('data-term', props.discussionTerm)
    } else {
      script.setAttribute('data-mapping', giscusConfig.mapping)
    }
  }

  container.value.appendChild(script)
}

function updateTheme() {
  const iframe = container.value?.querySelector('iframe.giscus-frame') as
    | HTMLIFrameElement
    | null

  iframe?.contentWindow?.postMessage(
    {
      giscus: {
        setConfig: {
          theme: getGiscusTheme(isDark.value),
        },
      },
    },
    'https://giscus.app',
  )
}

onMounted(renderGiscus)
onBeforeUnmount(clearContainer)

watch(isDark, updateTheme)
</script>
