<template>
  <div>
    <div class="topNav" id="myTopNav">
      <a v-on:click="goTo('/')" >Home</a>
      <a v-if="isLoggedIn" v-on:click="goTo('/auctions/create')">Create Auction</a>
      <a v-if="isLoggedIn" v-on:click="goTo('/messenger')">Chat</a>
      <a v-if="isLoggedIn" v-on:click="goTo('/user')">UserInfo</a>
      <a class="right" v-if="isLoggedIn" v-on:click="signOut">Sign Out</a>
      <a class="right" v-if="!isLoggedIn" v-on:click="goTo('/login')">Sign In</a>
      <a class="right" v-if="!isLoggedIn" v-on:click="goTo('/registration')">Sign Up</a>
      <a  class="icon" v-on:click="myFunction">
        <img :src="require('../assets/nav.jpg')" style="width: 20px; height: 20px;">
      </a>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'NavigationBar',
  computed: mapGetters(['isLoggedIn', 'user']),
  methods: {
    ...mapActions(['logout', 'disconnectSocket']),
    goTo: function (path) {
      this.$router.push(path).catch(() => { console.log('Avoided redundant navigation')})
    },
    signOut: async function () {
      await this.disconnectSocket()
      this.$router.push('/').catch(() => { console.log('Avoided redundant navigation')})
      await this.logout()
    },
    myFunction: function () {
      let x = document.getElementById("myTopNav");
      if (x.className === "topNav") {
        x.className += " responsive";
      } else {
        x.className = "topNav";
      }
    }

  }
}
</script>

<style scoped lang="scss">

  .topNav {
    overflow: hidden;
    background-color: #333;
  }

  .topNav a {
    float: left;
    display: block;
    color: #f2f2f2;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
    font-size: 17px;
  }
  .topNav .right {
    float: right;
  }

  .topNav a:hover {
    background-color: #ddd;
    color: black;
  }

  .topNav .icon {
    display: none;
  }

  @media screen and (max-width: 600px) {
    .topNav a:not(:first-child) {display: none;}
    .topNav a.icon {
      height: 20px;
      width: 20px;
      background: blue;
      float: right;
      display: block;
    }
  }

  @media screen and (max-width: 600px) {
    .topNav.responsive {position: relative;}
    .topNav.responsive .icon {
      position: absolute;
      background: blue;
      right: 0;
      top: 0;
    }
    .topNav.responsive a {
      float: none;
      display: block;
      text-align: left;
    }
  }

  /*.nav-bar {*/
  /*  border-bottom: 5px solid black;*/
  /*  position: fixed;*/
  /*  width: 100%;*/
  /*  background-color: #d3d3d3;*/
  /*  top: 0;*/

  /*  nav {*/
  /*    align-items: center;*/

  /*    .nav-item {*/
  /*      float: left;*/
  /*      text-transform: uppercase;*/
  /*      font-weight: 600;*/
  /*      font-size: 16px;*/
  /*      padding: 1em 2em;*/
  /*      color: #000000;*/
  /*      text-decoration: none;*/

  /*      &:hover {*/
  /*        background-color: #dcd3b6;*/
  /*        cursor: pointer;*/
  /*        transition: .2s;*/
  /*      }*/

  /*      &-right {*/
  /*        float: right;*/
  /*        &:hover {*/
  /*          background-color: red;*/
  /*          cursor: pointer;*/
  /*          transition: .2s;*/
  /*        }*/

  /*        &-green {*/
  /*          float: right;*/
  /*          &:hover {*/
  /*            background-color: green;*/
  /*            cursor: pointer;*/
  /*            transition: .2s;*/
  /*          }*/
  /*        }*/
  /*      }*/
  /*    }*/
  /*  }*/
  /*}*/
</style>
