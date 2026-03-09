<template>
  <GiscusComments
    v-if="discussionNumber"
    :key="`giscus:${commentPath}:${discussionNumber}`"
    :comment-path="commentPath"
    :discussion-number="discussionNumber"
  />
  <GiscusComments
    v-else
    :key="`giscus:${commentPath}:pathname`"
    :comment-path="commentPath"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { inBrowser, useRoute } from 'vitepress'
import discussionMap from '../data/discussion-map.json'
import { normalizeCommentPath } from '../data/comment-config'
import GiscusComments from './giscus-comments.vue'

const route = useRoute()

const commentPath = computed(() => {
  const rawPath = inBrowser ? window.location.pathname : route.path
  return normalizeCommentPath(rawPath)
})

const discussionNumber = computed(() => {
  const value =
    (discussionMap as Record<string, number | string | null | undefined>)[commentPath.value]

  const normalized =
    typeof value === 'string' ? Number.parseInt(value, 10) : value

  return Number.isInteger(normalized) && normalized > 0 ? normalized : null
})
</script>
