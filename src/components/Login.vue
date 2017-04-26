<template>
<div>
  <div id = "loplace">
    <button id = "login" v-on:click="login">授权登录</button>
 
  </div>
</div>
</template>
<script>
  export default {
    name: 'login',
    methods: {
      async login () {
        await this.$http.get('http://localhost:3006/api/getaccept').then(res => {
          console.log(res.body.data.url)
          window.location.href = res.body.data.url
        }, err => {
          console.log(err)
        })
      }
    }
  }
</script>
