<template>
  <div class="user">
    <h1>Welcome in UserInfo, {{this.user.username}}</h1>
    <div>
      <h1>User active auctions</h1>
      <div v-for="issuedAuction in getActiveAuctionsIssuedByUser" :key="issuedAuction._id" class="auction-active">
        <p @click="goToAuction(issuedAuction._id)">ISSUED AUCTION: {{ issuedAuction.title }}</p>
      </div>
    </div>
    <hr/>
    <div>
      <h1>Won Auctions</h1>
      <div v-for="wonAuction in getUserWonAuctions" :key="wonAuction._id" class="auction">
        <p>{{wonAuction.title}}</p>
      </div>
    </div>
    <hr/>
    <div>
      <h1>User History</h1>
      <div v-for="issuedAuction in getUserIssuedAuctionsHistory" :key="issuedAuction._id" class="auction">
        <p>{{issuedAuction.title}}</p>
      </div>
    </div>
    <hr/>
    <h1>User Observed Auctions</h1>
    <table class="auctions">
      <tr>
        <th>TITLE</th>
        <th>PRICE</th>
        <th>BETTER</th>
        <th>COUNTDOWN</th>
        <th>BET</th>
      </tr>
      <tr v-for="observedAuction in getAuctionsObservedByUser" :key="observedAuction._id" class="auction">
        <td @click="goToAuction(observedAuction._id)">{{observedAuction.title}} </td>
        <td>{{observedAuction.price}}</td>
        <td >
          {{observedAuction.offers[observedAuction.offers.length - 1].issuerName}}
        </td>
        <td class="auction-item auction-countdown" v-bind:class="observedAuction._id"></td>
        <td>
          <div>
            <auction-betting class="auction-betting" v-if="observedFetched" v-bind:auction="observedAuction"></auction-betting>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import AuctionBetting from "../components/AuctionBetting";


export default {
  name: 'User',
  components: {AuctionBetting},
  data(){
    return{
      intervalHandles: [],
      observedFetched: false
    }
  },
  component: {
    AuctionBetting
  },
  methods: {
    ...mapActions([
      'fetchUserActiveIssuedAuctions',
      'fetchUserWonAuctions',
      'fetchUserIssuedAuctionsHistory',
      'fetchUserObservedAuctions',
      'subscribeEvent',
      'emitEvent',
      'unsubscribeEvent',
      'applyObservedAuctionStateChange'
    ]),
    goToAuction: function(id){
      this.$router.push({path: `/auctions/${id}`})
    },
    handleBetEvent: function(data){
      this.applyObservedAuctionStateChange(data.auction);
    }
  },
  computed: mapGetters([
    'user',
    'getActiveAuctionsIssuedByUser',
    'getUserWonAuctions',
    'getUserIssuedAuctionsHistory',
    'getAuctionsObservedByUser'
  ]),
  created(){
    this.fetchUserActiveIssuedAuctions(this.user._id)
    this.fetchUserWonAuctions(this.user._id)
    this.fetchUserIssuedAuctionsHistory(this.user._id)
    this.fetchUserObservedAuctions(this.user._id)
      .then(() => {
        this.observedFetched = true;
        this.getAuctionsObservedByUser.forEach(auction => {
          let intervalHandle = setInterval(() => {
            let countdown = Date.parse(auction.expirationDate) - Date.parse(new Date());
            if (countdown <= 0) {
              this.intervalHandles = this.intervalHandles.filter(handle => handle != intervalHandle);
              window.clearInterval(intervalHandle);
              if(auction.buyer != this.user._id){
                document.getElementsByClassName(auction._id)[0].innerHTML = "LOST";
              } else {
                document.getElementsByClassName(auction._id)[0].innerHTML = "WON";
              }
              return;
            }
            let seconds = Math.floor( (countdown/1000) % 60 );
            let minutes = Math.floor( (countdown/1000/60) % 60 );
            let hours =  Math.floor( (countdown/(1000*60*60)) % 24 );
            let days = Math.floor( countdown/(1000*60*60*24) );
            let deadlineCounter = `${days}d:${hours}h:${minutes}m:${seconds}s`;
            document.getElementsByClassName(auction._id)[0].innerHTML = deadlineCounter;
          }, 1000);
          this.intervalHandles.push(intervalHandle)
        });
        this.subscribeEvent({eventName: "auctionBet", handler: this.handleBetEvent});
      });
  },
  destroyed(){
    this.unsubscribeEvent("auctionBet")
    this.intervalHandles.forEach(handle => window.clearInterval(handle));
  }
}
</script>

<style scoped lang="scss">
  .user {
    @import "../assets/exports";
    padding: 1%;
    border: 5px solid black;
    margin-left: auto;
    margin-right: auto;
    width: 80%;
    background-color: #dcd3b6;
    font-size: large;
    font-weight: bold;
    margin-bottom: 2%;

    .auction {
      &-active {
        border: 2px solid black;
        margin: auto;
        width: 80%;
        background-color: darkgoldenrod;
        &:hover {
          background-color: brown;
          color: white;
          cursor: pointer;
          transition: .2s;
        }
      }
    }

    table {
      margin: auto;
      width: 80%;
      text-align: center;
    }

    .auctions {
      width: 80%;
      margin-bottom: 1%;
      font-weight: normal;
      font-size: medium;
      th {
        font-weight: normal;
        margin: 0;
        border-bottom: 2px solid black;
      }
      td {
        border: 2px solid black;
      }
      .auction {

      }
    }
  }
</style>
