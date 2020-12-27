export default function(config) {
  // 大写转驼峰
  const hyphenateRE = /\B([A-Z])/g
  const hyphenate = function(str) {
    return str.replace(hyphenateRE, '-$1').toLowerCase()
  }

  return `
<!--局部样式-->
<style lang="scss" scoped>
    .${hyphenate(config.pageName)} ::v-deep.${hyphenate(config.pageName)}-dialog{
      ${config.cols === 1 ? `max-width: 600px;` : ''}
      ${config.cols > 1 ? `width: ${500 + config.cols * 300}px;` : ''}
    }
</style>`
}
