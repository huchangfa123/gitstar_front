<template>
 <div class="container main-container">
        <div class="sider">
            <img :src="useravatar" alt="">
            <h1>{{username}}</h1>
            <ul class="categorys">
                <li class="all" @click="resetstarspj()">ALL CATEGORYS</li>
                <li v-for="tag in recenttag" :key="tag.index" @click="getdatabytag(tag.tagname)">{{tag.tagname}} <span class="num">{{tag.tagusestime}}</span></li>
            </ul>
        </div>
        <div class="star-list">
            <div class="box" v-for="star in starspj" :key="star.index">
                <a class="box-title" :href="star.url">{{star.pjname}}</a> <span class="remark">{{star.secname}}</span><span class="new-remark" @click="setsecnamepjid(star.index)"><i class="icon-remark"></i></span>
                <div class="content" v-if="star.personalintro === ''">
                    {{star.intro}}
                </div>
                <div class="content" v-else>
                    {{star.personalintro}}
                </div>
                <div class="footer">
                    <span class="star"><i class="icon-star"></i>{{star.stargazers}}</span>
                    <el-tag v-for="tag in star.tag" :color="tag.TagColor" closable="true" @close="handleClose(star.index, tag.TagName)">{{tag.TagName}}</el-tag>&nbsp;&nbsp;
                    <span class="new-tag"><i class="icon-add"  @click="settagpjid(star.index)"></i></span>
                </div>
            </div>
            <div class="loading">
            </div>            
        </div>
        <el-dialog title="设置标签" v-model="dialogVisible" size="tiny">
          <span class="dialog_data">
            <el-input v-model="tagname" placeholder="请输入内容" ref="tagname"></el-input>
            <el-color-picker id="tagcolorpicker" v-model="defaultcolor"></el-color-picker>
          </span>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="settags">确 定</el-button>
            <el-button @click="dialogVisible = false">取 消</el-button>
          </span>
        </el-dialog>
        <el-dialog title="设置别名" v-model="dialogVisible2" size="tiny">
          <span class="dialog_data">
            <el-input class="secnameinput" v-model="secname" placeholder="请输入内容" ref="secname"></el-input>
            <el-input class="personalintroinput" v-model="personalintro" type="textarea" :rows="4" placeholder="请输入内容" ref="personalintro"></el-input>
          </span>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="setsecname">确 定</el-button>
            <el-button @click="dialogVisible2 = false">取 消</el-button>
          </span>
        </el-dialog>
  </div>
</template>
<script>
  import _ from 'lodash'
  import { mapActions } from 'vuex'
  export default {
    name: 'first',
    created () {
      const URL = document.URL
      const alldata = URL.split('?')[1]
      const data = alldata.split('=')[1]
      const code = data.split('&')[0]
      this.getrectag()
      this.getstars(code)
    },
    methods: {
      ...mapActions(['settag', 'setsecnameandintro', 'deletetag', 'getrecenttag', 'getdatabytag', 'getstarpj']),
      // 获取最近添加的标签
      async getrectag () {
        let res = await this.getrecenttag()
        console.log(res)
        this.recenttag = res.body.data.result
      },
      // 获取star的项目数据
      async getstars (code) {
        console.log(code)
        let res = await this.getstarpj({code})
        const result = res.body.data.result
        this.starspj = _.cloneDeep(result)
        this.allstarpj = _.cloneDeep(result)
        this.username = res.body.userMessage.username
        this.useravatar = res.body.userMessage.avatarUrl
      },

      // 根据标签获取项目数据
      async getdatabytag (ntag) {
        let res = await this.getdatabytag({ntag})
        this.starspj = res.body.data.result
      },

      resetstarspj () {
        const data = this.allstarpj
        this.starspj = _.cloneDeep(data)
      },

      // 设置标签
      async settags () {
        const id = this.starspj[this.pjid].id
        const tag = this.$refs.tagname.value
        const color = this.defaultcolor
        let res = await this.settag({id, tag, color})
        const tagname = res.body.tag.tagname
        const rescolor = res.body.tag.tagcolor
        console.log(this.starspj[id])
        this.starspj[this.pjid].tag.push({
          TagName: tagname,
          TagColor: rescolor
        })
        this.allstarpj[this.pjid].tag.push({
          TagName: tagname,
          TagColor: rescolor
        })
        this.dialogVisible = false
      },
      // 设置别名和备注
      async setsecname () {
        const id = this.starspj[this.pjid].id
        const secname = this.$refs.secname.value
        const personalintro = this.$refs.personalintro.value
        let res = await this.setsecnameandintro({id, secname, personalintro})
        this.starspj[this.pjid].secname = res.body.data.secname
        this.starspj[this.pjid].personalintro = res.body.data.personalintro
        this.dialogVisible2 = false
      },

      settagpjid (id) {
        this.dialogVisible = true
        this.pjid = id
        this.tagname = ''
      },
      setsecnamepjid (id) {
        this.dialogVisible2 = true
        this.pjid = id
        this.secname = this.starspj[id].secname
        this.personalintro = this.starspj[id].personalintro
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
        const tid = this.starspj[id].id
        this.removeTagByValue(this.starspj[id].tag, tag)
        this.removeTagByValue(this.allstarpj[id].tag, tag)
        let result = await this.deletetag({tid, tag})
        console.log(result)
      }
    },
    data () {
      return {
        tagname: '',
        username: '',
        useravatar: '',
        recenttag: [],
        starspj: [],
        allstarpj: [],
        dialogVisible: false,
        dialogVisible2: false,
        secname: '',
        personalintro: '',
        pjid: '',
        defaultcolor: '#20a0ff'
      }
    }
  }
</script>
<style scoped>
  @import '../assets/spectre.min.css';
  @import '../assets/style.css';

  .main-container {
    max-width: 960px;
    margin-top: 100px;
  }
  .main-container .sider {
    width: 170px;
    float: left;
    position: -webkit-sticky;
    position: sticky;
    top: 10px;
  }
  .main-container .sider img {
    width: 150px;
    height: 150px;
    margin: 0 10px;
  }
  .main-container .sider h1 {
    font-size: 2.5rem;
    font-weight: 400;
    margin-top: 15px;
    padding: 5px;
    text-align: center;
  }
  .main-container .sider ul.categorys {
    list-style: none;
    margin: 0;
  }
  .main-container .sider ul.categorys li {
    padding: 5px;
    border-radius: 3px;
    margin: 0;
    cursor: default;
  }
  .main-container .sider ul.categorys li.all {
    text-align: center;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
  }
  .main-container .sider ul.categorys li:hover {
    background-color: #f9f9f9;
  }
  .main-container .sider ul.categorys li.active {
    color: #0b1e7f;
    font-weight: 700;
  }
  .main-container .sider ul.categorys li.active span.num {
    background-color: #5998fd;
    color: #fff;
    font-weight: 400;
  }
  .main-container .sider ul.categorys li span.num {
    float: right;
    padding: 0 5px;
    border-radius: 3px;
  }
  .main-container .sider ul.categorys li span.color {
    display: inline-block;
    height: 11px;
    width: 11px;
    border-radius: 50%;
    background-color: #0b1e7f;
    margin-right: 3px;
  }
  .main-container .star-list {
    margin-left: 190px;
  }
  .main-container .box {
    border: .1rem solid #f0f1f4;
    margin-bottom: 10px;
    padding: 12px;
  }
  .main-container .box:hover span.new-remark {
    display: inline-block;
  }
  .main-container .box:hover .footer span.new-tag {
    display: inline-block;
  }
  .main-container .box a.box-title {
    font-size: 16px;
    font-weight: 400;
    color: #0366d6;
  }
  .main-container .box span.remark {
    font-size: 12px;
    color: #9e9e9e;
    margin-left: 5px;
  }
  .main-container .box span.new-remark {
    display: none;
    cursor: pointer;
    margin-left: 5px;
    color: #cacaca;
  }
  .main-container .box span.new-remark:hover {
    color: #4c4c4c;
  }
  .main-container .box .content {
    font-size: 13px;
    margin: 5px 0;
  }
  .main-container .box .footer {
    margin-top: 15px;
  }
  .main-container .box .footer span {
    font-size: 12px;
    margin: 0 3px;
  }
  .main-container .box .footer label {
    padding: 3px 5px;
    font-size: 12px;
    background-color: #f9f9f9;
    border-radius: 3px;
  }
  .main-container .box .footer span.new-tag {
    display: none;
    cursor: pointer;
    color: #cacaca;
  }
  .main-container .box .footer span.new-tag:hover {
    color: #4c4c4c;
  }
  @media screen and (max-width: 600px) {
    .sider {
    display: none;
  }
  .star-list {
    margin-left: 0px !important;
  }

  }
  .auth-page {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
  .auth-page img {
    width: 300px;
    height: 300px;
    margin-top: -10%;
  }
  .auth-page h1 {
    font-size: 3rem;
    margin: 1rem 0;
  }
  .auth-page button {
    outline: none;
    padding: .75rem 2rem;
    border: .1rem solid #0b1e7f;
    border-radius: 3px;
    background-color: #fff;
    transition: background-color linear 0.15s;
  }
  .auth-page button:hover {
    background-color: #f9f9f9;
    transition: background-color linear 0.15s;
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
  .personalintroinput {
    margin-top: 5px;
  }
</style>
