<template>
<div class="content">
  <div class="vertical-icon-bar">
      <el-col :span="5">
        <el-menu default-active="2" class="el-menu-vertical-demo">
          <el-menu-item index="1"><i class="el-icon-message"></i>用户信息</el-menu-item>
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-menu"></i>最近标签</template>
              <el-menu-item-group  v-for="tag in recenttag" :key="tag.index">
                <el-menu-item index="tag.index" @click="getdatabytag(tag.tagname)">{{tag.tagname}}</el-menu-item>
              </el-menu-item-group>
                <el-menu-item @click="resetstarspj()">更多标签</el-menu-item>
          </el-submenu>
          <el-menu-item index="3"><i class="el-icon-caret-left"></i>退出登录</el-menu-item>
        </el-menu>
      </el-col>
  </div>
  <div class="starsblock">
    <ul class="starlist">
      <li v-for="star in starspj" :key="star.index">
        <div class="pjbasicmessage">
          <div class="pjmessage">
            <a :href="star.url"><h3>{{star.pjname}}</h3></a>
            <div class="pjintro">
              <p>{{star.intro}}</p>
            </div>
            <div class="tagblock">
              <div class="tagshowblock" v-for="tag in star.tag">
                <el-tag :color="tag.TagColor" closable="true" @close="handleClose(star.index, tag.TagName)">{{tag.TagName}}</el-tag>&nbsp;&nbsp;
              </div>
              <div class="addtag">
                <el-button :id = "star.index" class="addtagbutton" type="text" icon="plus" @click="setpjid(star.index)"></el-button>
              </div>
            </div>
          </div>
          <div class="language">
            <span><i class="el-icon-upload"></i>&nbsp;&nbsp;{{star.language}}</span>
          </div>
          <div class="starnum">
            <span><i class="el-icon-star-on"></i>&nbsp;&nbsp;{{star.stargazers}}</span>
          </div>
        </div>
      </li>
      <el-dialog title="提示" v-model="dialogVisible" size="tiny">
        <span class="dialog_data">
          <el-input v-model="input" placeholder="请输入内容" ref="tagname"></el-input>
          <el-color-picker id="tagcolorpicker" v-model="defaultcolor"></el-color-picker>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="settags">确 定</el-button>
          <el-button @click="dialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </ul>
  </div>
</div>
</template>
<script>
  export default {
    name: 'first',
    created () {
      const URL = document.URL
      const alldata = URL.split('?')[1]
      const data = alldata.split('=')[1]
      const code = data.split('&')[0]
      this.getrecenttag()
      this.getstars(code)
    },
    methods: {
      // 获取最近添加的标签
      async getrecenttag () {
        await this.$http.get('http://localhost:3006/api/getrecenttag').then(res => {
          // console.log(res.body)
          this.recenttag = res.body.data.result
        }, err => {
          console.log(err)
        })
      },

      // 获取star的项目数据
      async getstars (code) {
        await this.$http.post('http://localhost:3006/api/getstar', {
          code: code
        }).then(res => {
          // console.log(res.body.data.result)
          this.starspj = res.body.data.result
          this.allstarpj = res.body.data.result
        }, err => {
          console.log(err)
        })
      },

      // 根据标签获取项目数据
      async getdatabytag (ntag) {
        const tag = ntag
        await this.$http.post('http://localhost:3006/api/taggetpj', {
          tag: tag
        }).then(res => {
          this.starspj = res.body.data.result
        }, err => {
          console.log(err)
        })
      },

      resetstarspj () {
        this.starspj = this.allstarpj
      },

      // 设置标签
      async settags () {
        const id = this.pjid
        const tag = this.$refs.tagname.value
        const color = this.defaultcolor
        console.log(color)
        await this.$http.post('http://localhost:3006/api/set', {
          id: this.starspj[id].id,
          tag: tag,
          color: color
        }).then(res => {
          const tagname = res.body.tag.tagname
          const color = res.body.tag.tagcolor
          // console.log(tagname)
          this.starspj[id].tag.push({
            TagName: tagname,
            TagColor: color
          })
          this.allstarpj[id].tag.push({
            TagName: tagname,
            TagColor: color
          })
        })
        this.dialogVisible = false
      },
      setpjid (id) {
        this.dialogVisible = true
        this.pjid = id
      },
      removeTagByValue (arr, val) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].TagName === val) {
            arr.splice(i, 1)
            break
          }
        }
      },
      // 删除标签
      async handleClose (id, tag) {
        this.removeTagByValue(this.starspj[id].tag, tag)
        this.removeTagByValue(this.allstarpj[id].tag, tag)
        await this.$http.post('http://localhost:3006/api/deletetag', {
          id: this.starspj[id].id,
          tag
        }).then(res => {
          console.log(res.body.message)
        })
      }
    },
    data () {
      return {
        recenttag: [],
        starspj: [],
        allstarpj: [],
        dialogVisible: false,
        input: '',
        pjid: '',
        defaultcolor: '#20a0ff'
      }
    }
  }
</script>
<style scoped>
  .pjbasicmessage{
    border:0;
    border-top:1px solid #DDDDDD;
    border-bottom:1px solid solid #DDDDDD;
    width: 1000px;
    height: 200px;
    margin-left: 300px;
    margin-right: 150px;
  }
  .starlist li{
    list-style: none
  }
  .pjmessage{
    margin-left: 30px; 
    float: left;
    text-align: left;
    width: 500px;
  }
  .pjmessage p{ 
    font-size: 14px
  }
  .pjintro{
    overflow:hidden; 
    text-overflow:ellipsis;
    display:-webkit-box; 
    -webkit-box-orient:vertical;
    -webkit-line-clamp:2; 
    height: 75px;
  }
  .language{
    margin-top: 20px;
    float: left;
    text-align: center;
    width: 200px;
  }
  .starnum{
    margin-top: 20px;
    float: left;
    text-align: center;
    width: 200px;
  }
  .tagshowblock{
    float: left;
  }
  .addtag{
    float: left;
  }
  .addtagbutton{
    padding-top: 5px
  }
  .dialog_data input{
    float: left
  }
  #tagcolorpicker {
    float: left;
    margin-top: 5px 
  }
  .dialog-footer {
    margin-top:20px;
    display:flex;
    justify-content: center;
    align-items: center; 
  }
</style>
