---
layoutClass: m-nav-layout
outline: [ 2, 3, 4 ]
---

<script>import {NAV_DATA} from './data';
export default {
  setup() {
    return { NAV_DATA }
  }
}
</script>
<style>
@import './index.scss';
</style>

# 前端导航
<MNavLinks v-for="{title, items} in NAV_DATA" :title="title" :items="items" />
