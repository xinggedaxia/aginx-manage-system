<template>
  <div ref="toastuiEditor" />
</template>
<script>
import Editor from '@toast-ui/editor'
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer'
import 'highlight.js/styles/github.css'
import color from '@toast-ui/editor-plugin-color-syntax'
import '@toast-ui/editor/dist/i18n/zh-cn'
import { optionsMixin } from './mixin/option'
import 'codemirror/lib/codemirror.css' // Editor's Dependency Style
import '@toast-ui/editor/dist/toastui-editor.css' // Editor's Style
import '@toast-ui/editor/dist/toastui-editor-viewer.css'
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight'
import defaultOptions from './default-options'
import hljs from 'highlight.js'

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
    },
    viewModal: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      editorValue: this.answer
    }
  },
  watch: {
    previewStyle(newValue) {
      this.editor.changePreviewStyle(newValue)
    },
    height(newValue) {
      this.editor.height(newValue)
    },
    answer(newValue) {
      this.editor.setMarkdown(newValue)
    }
  },
  mounted() {
    const options = {
      ...this.computedOptions,
      ...defaultOptions,
      plugins: [[codeSyntaxHighlight, { hljs }], color],
      el: this.$refs.toastuiEditor
    }
    if (this.viewModal) {
      this.editor = new Viewer(options)
      this.editor.setMarkdown(this.answer)
    } else {
      this.editor = new Editor(options)
      this.editor.setMarkdown(this.answer)
      // 监听输入
      this.editor.on('change', () => {
        // 存储当前编辑器的值，在父组件点击保存时，通过$refs获取
        this.editorValue = this.editor.getMarkdown()
        this.$emit('editorChange')
      })
    }
  }
}
</script>
