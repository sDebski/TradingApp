<template>
  <div>
    <p v-if="getNotSeenMessagesArray.length === 0">You are up to date</p>
    <div v-else class="messages">
      <div class="notMyMsg"
           v-for="message in getNotSeenMessagesArray"
           :key="message.id">
        <label class="sender"> {{ message.sender }} </label>
        <div class="msg.data">
          {{ message.message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name: "NotSeenMassages",
  computed: mapGetters([
    'getNotSeenMessagesArray'
  ]),
  methods: {

  }
}
</script>

<style scoped lang="scss">
  .messages {
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
    .notMyMsg {
      background: lightpink;
    }
    .sender {
      font-weight: bold;
    }
  }
</style>
