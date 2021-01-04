<template>
  <div ref="toastuiEditor"/>
</template>
<script>
import Editor from '@toast-ui/editor'
import highlight from '@toast-ui/editor-plugin-code-syntax-highlight'
import color from '@toast-ui/editor-plugin-color-syntax'
import '@toast-ui/editor/dist/i18n/zh-cn'
import { optionsMixin } from './mixin/option'
import 'codemirror/lib/codemirror.css' // Editor's Dependency Style
import '@toast-ui/editor/dist/toastui-editor.css' // Editor's Style
import defaultOptions from './default-options'

export default {
  name: 'ToastuiEditor',
  mixins: [optionsMixin],
  props: {
    previewStyle: {
      type: String
    },
    height: {
      type: String
    },
    initialEditType: {
      type: String
    },
    initialValue: {
      type: String
    },
    options: {
      type: Object
    },
    answer: {
      type: String
    }
  },
  watch: {
    previewStyle(newValue) {
      this.editor.changePreviewStyle(newValue)
    },
    height(newValue) {
      this.editor.height(newValue)
    }
  },
  mounted() {
    const options = {
      ...this.computedOptions,
      ...defaultOptions,
      plugins: [highlight, color],
      el: this.$refs.toastuiEditor
    }
    console.log(options)
    this.editor = new Editor(options)
    this.editor.setMarkdown(this.answer)
    this.editor.on('change', () => {
      this.$emit('update:answer', this.editor.getMarkdown())
      this.$emit('update:html', this.editor.getHtml())
    })
  },
  methods: {
    getRootElement() {
      return this.$refs.toastuiEditor
    }
  }
}
</script>
