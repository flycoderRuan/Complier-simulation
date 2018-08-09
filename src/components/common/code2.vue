<template>
  <div class="code">
    <div class="setting">
      <textarea id="editor2" name="editor2">
      </textarea>
    </div>
  </div>
</template>

<script>
import * as CodeMirror from 'codemirror/lib/codemirror'
import '../../../static/codemirrorSetting/neat.css'// 白色朴素
import '../../../static/codemirrorSetting/liquibyte.css'// 白色高亮
import '../../../static/codemirrorSetting/cobalt.css'// 黑色朴素
import 'codemirror/theme/mdn-like.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/clike/clike'
import 'codemirror/mode/go/go'
import 'codemirror/mode/htmlmixed/htmlmixed'
import 'codemirror/mode/http/http'
import 'codemirror/mode/php/php'
import 'codemirror/mode/python/python'
import 'codemirror/mode/sql/sql'
import 'codemirror/mode/vue/vue'
import 'codemirror/mode/xml/xml'
import 'codemirror/addon/scroll/simplescrollbars.css'
import 'codemirror/addon/scroll/simplescrollbars'
// import 'codemirror/addon/hint/show-hint'
// import 'codemirror/addon/hint/javascript-hint'
// import 'codemirror/addon/hint/sql-hint'
// import 'codemirror/addon/hint/html-hint'
// import 'codemirror/addon/hint/xml-hint'
// import 'codemirror/addon/hint/anyword-hint'
// import 'codemirror/addon/hint/css-hint'
// import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/fold/markdown-fold'
import 'codemirror/mode/meta'

import 'codemirror/addon/fold/foldgutter.css'

import 'codemirror/addon/fold/foldcode'

import 'codemirror/addon/fold/brace-fold'
import 'codemirror/addon/selection/active-line'

export default {
  data () {
    return {
      CodeMirrorEditor: null,
      hasinput: false
    }
  },

  mounted () {
    this.setmirror()
  },

  methods: {
    transToSrc (name) {
      return 'assets/codemirror/mode/' + name + '/' + name + '.js'
    },
    setmirror () {
      let myTextarea = document.getElementById('editor2')
      this.CodeMirrorEditor = CodeMirror.fromTextArea(myTextarea, {
        theme: 'mdn-like',
        styleActiveLine: true,
        mode: 'text/x-c++src',
        // mode: 'javascript',
        extraKeys: {'Ctrl': 'autocomplete'}, // 输入s然后ctrl就可以弹出选择项
        lineNumbers: true,
        tabSize: 10,
        // readOnly:"nocursor",
        smartIndent: true,
        scrollbarStyle: 'overlay'
        // keymap:"defaule"
      })
      // // this.CodeMirrorEditor.setOption('lineWrapping', true);
      // this.CodeMirrorEditor.on('change', () => {
      //   // 编译器内容更改事件
      //   // sessionStorage.setItem('msg', this.CodeMirrorEditor.getValue())
      //   this.$emit('tokenchange', this.CodeMirrorEditor.getValue())
      //   if (this.CodeMirrorEditor.getValue() !== '') {
      //     this.hasinput = true
      //   } else {
      //     this.hasinput = false
      //   }
      // })
      // this.CodeMirrorEditor.setValue("Hello Kitty\nHello Tony\nHow are you\nFine thank you and you \nI love you")

      // this.CodeMirrorEditor.setOption("lineNumbers","true")
      // // this.CodeMirrorEditor.addOverlay("coconut");
      // // this.CodeMirrorEditor.markText({line:0,ch:0},{line:0,ch:0})
      // this.CodeMirrorEditor.setBookmark({line:0,ch:0},{line:0,ch:1},{readOnly:true});
      // this.CodeMirrorEditor.setCursor(0)
      this.CodeMirrorEditor.setSize(850, 680)
    },
    resetForm (formName) {
      this.CodeMirrorEditor.setValue('')
    },
    showcode (str, language) {
      this.$nextTick(() => {
        var headElement = document.body
        var element = document.createElement('script')
        element.setAttribute('src', this.transToSrc(language))
        headElement.appendChild(element)
        element.onload = () => {
          this.CodeMirrorEditor.setOption('mode', language)
        }
        this.CodeMirrorEditor.setValue(str)
      })
    }
  }

}
</script>

<style scoped>
.code {
  position: relative;
  margin: 0;
  width: auto;
  height: auto;
  background-color: rgb(248, 248, 248);
  /*h1 {
    margin: 0;
  }*/
}
.resetbutton{
  position:absolute;
  right:0px;
  top:4.2px;
  cursor: pointer;
  width: 30px;
  height: 30px;
  border: none;
  background-color: #ffffff;
  outline: none;
  margin: 0;
  z-index: 5;
}
.setting{
  width:93%
}
</style>
<style>
.CodeMirror pre{
  font-size:16px;
  /*font-family:Arial;*/
}
.CodeMirror-line{}
</style>
