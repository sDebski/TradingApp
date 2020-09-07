<template>
  <div class="auction-modify">
    <form @submit.prevent="onSubmit">
      <div>
        <label>Expiration date: </label>
        <input type="datetime-local" v-model=expirationDate >
      </div>
      <div>
        <label>Title: </label>
        <input type="text" v-model=title>
      </div>
      <div>
        <label>Price: </label>
        <input type="number"  v-model=price>
      </div>
      <div>
        <label>Is buy now?</label>
        <input type="checkbox" v-model=isBuyNow>
      </div>
      <div class="update-div">
        <button class="button left" type="submit">UPDATE</button>
        <span v-if="isModified" class="green notification right">Updated!</span>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions, mapGetters }  from "vuex";
export default {
  name: 'AuctionModify',
  data(){
    return {
      isModified: false,
      expirationDate: "",
      title: "",
      price: "",
      isBuyNow: "",
    }
  },
  props: ["auction"],
  computed: mapGetters(["getAuctionStatus"]),
  methods: {
    ...mapActions(["updateAuction", "emitEvent"]),
    onSubmit: function(){
      this.updateAuction({
        auctionId: this.auction._id,
        expirationDate: this.expirationDate,
        title: this.title,
        isBuyNow: this.isBuyNow,
        price: this.price
      })
      this.isModified = true;
    }
  },
  created(){
    if(this.auction.expirationDate){
      this.expirationDate = this.auction.expirationDate.toString().slice(0, 16);
    }
    this.title = this.auction.title;
    this.price = this.auction.price;
    this.isBuyNow = this.auction.isBuyNow;
  },
  destroyed() {
    this.isModified = false;
  }
}
</script>

<style scoped lang="scss">
  .auction-modify {
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 1%;
    width: 70%;
    padding: 1%;
    border: 5px solid black;
    @import "../assets/exports";
    background-color: #dcd3b6;
    font-size: large;
    font-weight: bolder;
    div {
      margin: 1%;
      padding: 0.5%;
    }
    .update-div {
      margin: auto;
      min-height: 50px;
      width: 250px;
    }
    .green {
      color: green;
    }
    .notification {
      font-size: medium;
      font-weight: bold;
    }
    .left {
      float: left;
    }
    .right {
      float: right;
    }
  }
</style>
