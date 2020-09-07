<template>
  <div class="login">
    <form @submit.prevent="submitClicked">
      <h1>SIGN IN</h1>
      <div>
        <label>USERNAME: </label>
        <input type="text" v-model="username" name="username" placeholder="Username"/>
      </div>
      <div>
        <label>PASSWORD: </label>
        <input type="password" v-model="password" name="password" placeholder="Password"/>
      </div>
      <button class="button" type="submit">Login</button>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    ...mapActions(['login', 'connectSocket', 'reconnectSocket']),
    submitClicked: function () {
      const { username, password } = this
      if( username !== '' && password !== '') {
        this.login({ username, password })
          .then(() => {
            if (this.getAuthStatus === 'successful') {
              //this.connectSocket()
              this.reconnectSocket()
              this.$router.push('/')
            } else {
              alert("Error while logging: " + this.getAuthError)
              console.log('AUTH FAILED')
            }
          })
      }
    }
  },
  computed: mapGetters(['getAuthStatus', 'getAuthError'])
}
</script>

<style scoped lang="scss">
  .login {
    @import "../assets/exports";
    font-size: large;
    font-weight: bolder;
    border: 5px solid black;
    margin: auto;
    background-color: darkgoldenrod;
    padding: 1%;
    width: 50%;
    div {
      margin: 15px;
    }
  }
</style>
