<template>
  <div class="registration">
    <h1>SIGN UP</h1>
    <form v-on:submit.prevent="submitClicked">
      <div>
        <label>USERNAME: </label>
        <input type="text" v-model="username" name="username" placeholder="Username"/>
      </div>
      <div>
        <label>PASSWORD: </label>
        <input type="password" v-model="password" name="password" placeholder="Password"/>
      </div>
      <button class="button" type="submit">Register</button>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'RegistrationView',
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    ...mapActions(['register']),
    submitClicked: function () {
      if( this.username !== '' && this.password !== '') {
        this.register(this)
          .then(() => {
            if (this.getRegisterStatus === 'successful') {
              this.$router.push('/login')
            }
            else alert('Error while registration: ' + this.getRegisterError)
          })
      }
    }
  },
  computed: mapGetters(['getRegisterStatus', 'getRegisterError'])
}
</script>

<style scoped lang="scss">
  .registration {
    @import "../assets/exports";
    font-size: large;
    font-weight: bolder;
    border: 5px solid black;
    margin: auto;
    background-color: lightblue;
    padding: 1%;
    width: 50%;
    div {
      margin: 15px;
    }
  }

</style>
