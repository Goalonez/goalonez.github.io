<template>
    <div class="gitalk-container">
      <div id="gitalk-container"></div>
    </div>
</template>
<script>
import md5 from "md5"
import Gitalk from "gitalk"
import "gitalk/dist/gitalk.css"
export default {
  name: "gitalk",
  data() {
    return {}
  },
  mounted() {
    const commentConfig = {
      clientID: "66ef365895972f3184b9",
      clientSecret: "b0aed6752e07ec29e89872bf5dc2e212677dcbd5",
      repo: "goalonez.github.io",
      owner: "Goalonez",
      admin: ["Goalonez"],
      id: md5(location.pathname),
      distractionFreeMode: false,
    }
    const gitalk = new Gitalk(commentConfig)
    gitalk.render("gitalk-container")
  },
}
</script>
<style>
.gt-container .gt-header-textarea {
  color: #000;
}
</style>