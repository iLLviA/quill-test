import Vue from 'vue'
import VueQuillEditor from 'vue-quill-editor/dist/ssr'
import Quill from 'quill'
import ImageResize from 'quill-image-resize-module'

Quill.register('modules/imageResize', ImageResize)

let Embed = Quill.import('blots/embed');

class MyCutomTag extends Embed {
    static create(paramValue){
        let node = super.create()
        node.innerHTML = paramValue

        return node;
    }

    static value(node){
        return node.innerHTML;
    }
}

MyCutomTag.blotName = "my-custom-tag"
MyCutomTag.className = "my-custom-tag"
MyCutomTag.tagName = "my-custom-tag"

Quill.register(MyCutomTag)

Vue.use(VueQuillEditor)