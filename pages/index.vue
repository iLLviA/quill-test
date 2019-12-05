<template>
  <section class="container" ref="container">
    <div class="editor-content">
      <p>本文:</p>
      <div class="editor-content__outer">
        <div class="quill-editor" 
            :content="content"
            @change="onEditorChange($event)"
            @blur="onEditorBlur($event)"
            @focus="onEditorFocus($event)"
            @ready="onEditorReady($event)"
            @update="onEditorUpdate($event)"
            v-quill:myQuillEditor="editorOption">
        </div>
        <div :style="caretLocation">
          <el-dropdown  @command="test">
            <span class="el-dropdown-link">
              <i class="el-icon-circle-plus" />
            </span>
            <el-dropdown-menu slot="dropdown"  >
              <el-dropdown-item v-for="(data, index) in dropdownData" :key="index" :command="data">{{data}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <div class="editor-preview">
      <p>本文:</p>
      <div class="editor-preview__content" v-html="content" id="preview-content" style="font-size: 13px">
        <span ref="top"></span>
      </div>
      
    </div>
    {{this.position}}
  </section>
</template>

<script>

  export default {
    data () {
      return {
        content: null,
        exportJson: null,
        position: {
          top: 0,
          left: 0
        },
        caretIndex: {
          index: 0,
          length: 0
        },
        editorOption: {
          // some quill options
          theme: 'bubble',
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              ['my-custom-tag']
            ],
          }
        },
        dropdownData: [
          '店舗名',
          '管理番号',
          'メール送信日',
          '注文番号',
          '注文日時'
        ]
      }
    },
    computed: {
      caretLocation(){
        const { top, left, bottom, right } = this.position
        return {
          position: 'absolute',
          top: top - 3 + "px",
          left: left + 2 + "px"
        }
      }
    },
    mounted() {
      console.log('app init, my quill insrance object is:', this.myQuillEditor)
      this.position = this.myQuillEditor.getBounds(0)
    },
    methods: {
      test(command){
        console.log(this.caretIndex.index)
        this.myQuillEditor.insertEmbed(this.caretIndex.index, 'my-custom-tag', `$\{${command}\}`)
      },
      onEditorBlur(editor) {
        console.log('editor blur!', editor)
      },
      onEditorFocus(editor) {
        console.log('editor focus!', editor)
        const range = editor.getSelection() //forcusされた位置
        if(range) {
          if(range.length == 0){ // focusされた文字数が0の時
            console.log('User cursor is at index', range.index)
            this.position = editor.getBounds(range.index)
          } else {
            var text = editor.getText(range.index, range.length); //focueされた文字
            console.log('User has highlighted: ', text);
          } 
        }else { 
            console.log('User cursor is not in editor')
        }
        this.$scrollTo(this.$refs.top, 100, {
            container: "#preview-content",
            offset: this.position.top + 60
        })
      },
      onEditorReady(editor) {
        console.log('editor ready!', editor)
      },
      onEditorChange(editor) {
        console.log('editor change!', editor)
        this.caretIndex = editor.quill.getSelection()
        this.content = editor.html
        this.exportJson = editor.quill.getContents()
        this.position = editor.quill.getBounds(this.caretIndex.index)
        console.log(editor.quill.getBounds(this.caretIndex.index))
        console.log(this.position)
        // this.$scrollTo(this.$refs.top, 100, {
        //     container: "#preview-content",
        //     offset: this.position.top
        // })
      },
      onEditorUpdate(editor) {
        console.log('editor update!', editor)
      },
    }
  }
</script>

<style lang="scss" >
  .container {
    padding: 50px;
    display: flex;
    justify-content: space-between;
    background-color: #dad5d5;
    .editor-preview {
      padding: 10px;
      width: 50%;
      background-color: #f4f4fc;
      &__content {
        border: solid 1px #eee;
        border-radius: 10px;
        overflow-y: auto;
        background-color: #fff;
        height: 600px;
        padding: 10px;
        p {
          padding: 0;
          margin: 0;
          height: 18px;
        }
      }
    }
    .editor-content {
      background-color: #fff;
      width: 50%;
      padding: 10px;
      &__outer{
        position: relative;
      }
      .quill-editor {
        border: solid 1px #eee;
        border-radius: 10px;
        overflow-y: auto;
        height: 600px;
        position: relative;
    }
    }
  }
  .my-custom-tag {
    color :#409EFF;
    padding: 5px;
    border: solid 1px rgb(89, 171, 253);
    border-radius: 5px;
    background-color: #cee1fb;
    font-size: 4px;
  }
</style>