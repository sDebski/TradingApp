<template>
  <div class='createAuction'>
    <form v-on:submit.prevent='submitClicked'>
      <h1>Create new auction</h1>
      <div>
        <label>TITLE: </label>
        <input type='text' v-model='title' name='title' placeholder='auction title'/>
      </div>
      <div>
        <label>EXPIRATION DATE: </label>
        <input type='datetime-local' v-model='expirationDate' name='expirationDate' placeholder='expiration date'/>
      </div>
      <div>
        <label>PRICE: </label>
        <input type='number' v-model='price' name='price' placeholder='0'/>
      </div>
      <div>
        <label> BUY NOW AUCTION? </label>
        <input type='checkbox' v-model='isBuyNow' name='isBuyNow'/>
      </div>
      <button class="button" type='submit'>CREATE</button>
    </form>
  </div>
</template>

<script>

import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'AuctionCreateView',
  data () {
    return {
      title: '',
      price: 0,
      expirationDate: '',
      isBuyNow: true
    }
  },
  methods: {
    ...mapActions(['createAuction']),
    submitClicked: function () {
      this.createAuction(this)
        .then(newAuction => {
          if (this.getAuctionCreatingStatus === 'successful') {
            this.$router.push(`/auctions/${newAuction._id}`)
          }
        })
    }
  },
  computed: mapGetters(['getAuctionCreatingStatus'])
}
</script>

<style scoped lang="scss">

  .createAuction {
    font-size: large;
    font-weight: bolder;
    border: 5px solid black;
    margin: auto;
    width: 70%;
    background-color: sandybrown;
    padding-bottom: 1%;
    div {
      margin: 3%;
    }
    @import "../assets/exports";
  }


</style>
