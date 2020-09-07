<template>
  <div class="auction">
    <h1>{{this.getAuction.title}}</h1>
    <h3>PRICE: {{this.getAuction.price}}</h3>

    <!-- IS AUCTION ACTIVE -->
    <div v-if="this.getAuction.isActive">
      <!-- IS AUCTION STILL AVAILABLE -->
      <div v-if="this.isAvailable">
        <div v-if="this.getAuction.expirationDate" class="auction-deadline">
          <h1>{{this.deadlineCounter}}</h1>
        </div>
        <div v-if="this.user && this.getAuction.issuing != this.user._id" class="auction-action">
          <div v-if="this.getAuction.isBuyNow">
            <buy-now v-if="fetched" v-bind:auction="getAuction"></buy-now>
          </div>
          <div v-else>
            <auction-betting v-if="fetched" v-bind:auction="getAuction"></auction-betting>
          </div>
        </div>
      </div>
      <div v-else>
        <h3>EXPIRED</h3>
      </div>
    </div>
    <div v-else>
      <h2>Auction is not active yet</h2>
      <auction-modify v-if="fetched" v-bind:auction="getAuction"></auction-modify>
      <div v-if="this.getAuction.issuing === this.user._id">
        <button class="button" @click="activateAuction()">Activate</button>
      </div>
    </div>
    <div v-for="offer in this.getOffers" :key="offer._id" class="offer">
      <p>Offer from <b>{{offer.issuerName}}</b> for <b>{{offer.price}}</b></p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import AuctionModify  from "../components/AuctionModify";
import AuctionBetting from "../components/AuctionBetting";
import BuyNow from "../components/BuyNow";
export default {
  name: "Auctions",
  components: {
    "buy-now": BuyNow,
    "auction-betting": AuctionBetting,
    "auction-modify": AuctionModify
  },
  data(){
    return{
      deadlineCounter: "",
      offer: 0,
      fetched: false,
    }
  },
  methods: {
    ...mapActions([
      "fetchAuction",
      "updateAuction",
      "startAuction",
      "emitEvent",
      "subscribeEvent",
      "unsubscribeEvent",
      "applyAuctionStateChange"
    ]),
    activateAuction: function(){
      this.startAuction(this.$route.params.id)
        .then(() => {
          this.emitEvent("auctionUpdate", { id: this.$route.params.id });
          this.$router.push('/').catch(() => { console.log('Avoided redundant navigation')})
        });
    },
    loadAuction: function(){
      return this.fetchAuction(this.$route.params.id);
    },
    updateAuctionOnEvent: function(data){
      if(data.auction._id != this.getAuction._id){
        return;
      }
      this.applyAuctionStateChange(data.auction)
    }
  },
  computed:{
    ...mapGetters(["getAuction", "user", "getOffers", "isAvailable"])
  },
  created(){
    this.loadAuction()
      .then(() => {
        this.fetched = true;
        this.subscribeEvent({eventName:"auctionBet", handler: this.updateAuctionOnEvent})
        if(this.isAvailable) {
          setInterval(() => {
            let countdown = Date.parse(this.getAuction.expirationDate) - Date.parse(new Date());
            let seconds = Math.floor( (countdown/1000) % 60 );
            let minutes = Math.floor( (countdown/1000/60) % 60 );
            let hours =  Math.floor( (countdown/(1000*60*60)) % 24 );
            let days = Math.floor( countdown/(1000*60*60*24) );
            this.deadlineCounter = `Time to end: ${days}d:${hours}h:${minutes}m:${seconds}s`
          }, 1000)
        }
      });
  },
  destroyed(){
    this.unsubscribeEvent("auctionBet");
  }
}
</script>

<style scoped lang="scss">
  .auction {
    margin: auto;
    padding: 1%;
    width: 80%;
    border: 5px solid black;
    @import "../assets/exports";
    background-color: antiquewhite;
    font-weight: bold;
    font-size: large;
  }

</style>
