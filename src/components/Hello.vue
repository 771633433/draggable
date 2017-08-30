<template>
  <div id="app">
   <dialog-drag id="dialog-1">
      <p> 这片区域可以拖拽</p>
      <!-- 下面放置 视频框 -->

      <div style="float:left;">
   <object id="HisVideo" classid="CLSID:B0F9AA50-FB5E-4DB8-A33F-273834EBDBAE" width="440" height="370">
    <param name="MainServerIP" value="192.168.1.141" />
    <param name="HasBakServer" value="0" />
    <param name="BakServerIP" value="127.0.0.1" />
    <param name="ShowCtrlPane" value="0" />
    <param name="ShowMenu" value="0" />
  </object>
  
    </div>
    <table style="clear:both;display:none;">
            <tr>
            <td>
            <button id="btnPlayBack" class="asd" onclick="OnBtnClickhkPlayBack()">历史视频播放</button>
            <button id="btnSnap" class="asd" onclick="OnBtnClickSnap()">抓拍</button>
            <a id="his"></a>
            <a id="download"></a>
            </td>
        </tr>
  </table>
    </dialog-drag>
  </div>
</template>

<script>
import DialogDrag from 'vue-dialog-drag'
import DropArea from 'vue-dialog-drag/dist/drop-area'
export default {
  name:'app',
  components:{
    DialogDrag,
    DropArea
  },
  data () {
    return {

    }
  },

  methods:{
    drop(id){
      console.log('drop id:',id);
    }
  }
}
</script>

<style src="vue-dialog-drag/dist/vue-dialog-drag.css"></style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#dialog-1{
  width: 600px;
  height: 600px;
}
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
