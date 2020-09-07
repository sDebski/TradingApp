<template>
  <div class="messenger">
    <h1>See chat history and send message!</h1>
    <form v-on:submit.prevent="displayChatHistory">
      <div>
        <label>Recipient: </label>
        <select style="width: 100px;" v-model="recipient">
          <option  v-for="user in usersArray" v-bind:value="user" :key="user">
            {{ user }}
          </option>
        </select>
      </div>
      <button class="button" type="submit" :disabled="recipient === ''">Chat history</button>
    </form>
    <div v-show="isChatHistoryDisplayed">
      <div class="chat">
        <h1>Chat history here</h1>
        <div  :class="[message.sender === user.username ? 'myMsg' : 'notMyMsg']"
              v-for="message in getUserChatHistoryArray"
              :key="message.id">
          <label class="sender"> {{ message.sender }} </label>
          <div class="msg.data">
            {{ message.message }}
          </div>
        </div>
      </div>
      <form @submit.prevent="sendMessage">
        <div>
          <label>Message: </label>
          <input v-model="message" name="message" type="text">
        </div>
        <button class="button" type="submit">SEND</button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: 'Messenger',
  data() {
    return {
      recipient: "",
      message: "",
      isChatHistoryDisplayed: false,
      id: 1000
    }
  },
  methods: {
    ...mapActions(["emitEvent", "getAllUsersLogins", "getUserChatHistory", "subscribeEvent", "unsubscribeExactEvent"]),
    sendMessage: function () {
      if(this.message !== ''){
        this.emitEvent({
          eventName: "sendMessage",
          data: {
            recipient: this.recipient,
            message: this.message,
            id: this.id++
          }
        })
        this.getUserChatHistoryArray.push({
          sender: this.user.username,
          message: this.message
        })
        this.message = ''
      }
    },
    async displayChatHistory () {
      this.isChatHistoryDisplayed = !this.isChatHistoryDisplayed
      if(this.isChatHistoryDisplayed) {
        await this.getUserChatHistory({recipient: this.recipient})
        this.scrollToEnd()
      }
    },
    scrollToEnd () {
      const chatHistory = this.$el.querySelector('.chat')
      chatHistory.scrollTop = chatHistory.scrollHeight;
    },
    handleMessageMessageComponent: function(data){
      if(this.recipient === data.sender && this.isChatHistoryDisplayed) {
        this.getUserChatHistoryArray.push({
          sender: data.sender,
          message: data.message
        })
      }
    }
  },
  computed: mapGetters([
    'usersArray',
    'getAllLoginsStatus',
    'user',
    'getUserChatHistoryArray'
  ]),
  created () {
    this.getAllUsersLogins(this.user)
    this.subscribeEvent({eventName: 'message', handler: this.handleMessageMessageComponent})
  },
  destroyed () {
    this.unsubscribeExactEvent({eventName: 'message', handler: this.handleMessageMessageComponent})
    console.log('zniszczono')
  },
  updated() {
    this.scrollToEnd()
  }
}
</script>

<style scoped lang="scss">
  @import "../assets/exports.scss";
  .messenger {
    background-color: aquamarine;
    font-size: large;
    font-weight: bolder;
    padding: 3%;
    margin: auto;
    width: 50%;
    border: 5px solid black;
    div {
      margin: 1%;
    }
    .chat {
      text-align: left;
      max-height: 300px;
      overflow: scroll;
      background-color: lightgrey;
      font-size: medium;
      font-weight: lighter;
      padding: 1%;
      margin: auto;
      width: 80%;
      border: 5px solid black;
      .myMsg {
        background: lightblue;
      }
      .notMyMsg {
        background: lightpink;
      }
      .sender {
        font-weight: bold;
      }
    }

  }
</style>
