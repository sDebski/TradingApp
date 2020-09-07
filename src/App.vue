<template>
  <div id="app">
    <NavigationBar/>
    <div class="space"></div>
    <router-view/>
    <div v-if="user !== null" class="notSeenMessages">
      <h2>Unseen messages: {{ getNotSeenMessagesArray.length }}</h2>
      <button v-if="getNotSeenMessagesArray.length > 0" class="button" v-on:click="displayUnseenMessages"> {{ showHide }}</button>
      <not-seen-massages v-show="ifDisplayed"></not-seen-massages>
      <button class="button" v-on:click="clearUnseenMessages" v-show="ifDisplayed && getNotSeenMessagesArray.length !== 0">Clear</button>
    </div>
  </div>
</template>

<script>
import NavigationBar from './components/NavigationBar'
import { mapActions, mapGetters } from 'vuex';
import NotSeenMassages from "./components/NotSeenMassages";

export default {
  data () {
    return {
      ifDisplayed: false,
      showHide: 'show',
      id: 1000
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'getNotSeenMessagesArray'
    ])
  },
  components: {NotSeenMassages, NavigationBar },
  methods: {
    ...mapActions(['unsubscribeEvent', 'subscribeEvent', 'clearNotSeenMessages', 'addNotSeenMessage', 'isLoggedIn', 'disconnectSocket']),
    reactOnMessage: function(data){
      if( this.$route.path !== '/messenger'){
        this.addNotSeenMessage({
          message: data.message,
          sender: data.sender,
          id: this.id++
        })
      }
    },
    displayUnseenMessages () {
      this.ifDisplayed = !this.ifDisplayed
      this.showHide = (this.ifDisplayed) ? 'Hide' : 'Show'
    },
    clearUnseenMessages () {
      this.clearNotSeenMessages()
    }
  },
  created(){
    this.subscribeEvent({eventName: 'message', handler: this.reactOnMessage})
  },
  destroyed() {
    if (this.isLoggedIn)
      this.unsubscribeEvent('message')
    this.disconnectSocket()
  }
}
</script>

<style lang="scss">

  @import "./assets/exports";
  $blue: #33E6FF;
  $purple: #9C33FF;
  $grey: #A29FA6;
  $list: $blue, $purple, $grey;
  $left: "to left";

  @mixin gradient($direction, $list) {
    background: -webkit-linear-gradient($direction, $list);
    background: -moz-linear-gradient($direction, $list);
    background: -o-linear-gradient($direction, $list);
    background: linear-gradient($direction, $list);
  }

  body, html {

    @include gradient($left, $list);
    margin: 0 !important;
    padding: 0 !important;

    #app {
      font-family: Avenir, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-align: center;
      color: #2c3e50;

      .space {
        width: 100%;
        height: 100px;
      }
    }

    #nav {
      a {
        font-weight: bold;
        color: #2c3e50;

        &.router-link-exact-active {
          color: #42b983;
        }
      }
    }
  }

</style>
