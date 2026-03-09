import DefaultTheme from 'vitepress/theme'
import './custom.css'
// @ts-ignore
import PostComments from '../components/post-comments.vue'

export default {
  ...DefaultTheme,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp(ctx)
    ctx.app.component('PostComments', PostComments)
  },
}
