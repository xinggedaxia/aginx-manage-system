<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    }
  },
  // fixme: 元旦彩蛋
  mounted() {
    const appMain = document.querySelector('.app-main')
    let index = 1
    setInterval(function() {
      index = index++ % 12 + 1
      appMain.style.background = `center/cover url( ${require(`../../assets/images/yd${index}.${index <= 4 ? 'jpg' : 'png'}`)}) no-repeat`
    }, 10000)
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
  background: #f0f2f5;
  background: center/cover no-repeat url("../../assets/images/yd1.jpg"); /* fixme: 元旦彩蛋*/
  transition: all 1s;
}

.fixed-header + .app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
