<template>
  <div class="home">
    <h1> ACTIVE AUCTIONS</h1>
    <h2 v-if="user === null">You are not Logged in</h2>
    <table class="home-auctions">
      <tr>
        <th>TITLE</th>
        <th>PRICE</th>
        <th>BUY NOW?</th>
        <th>LAST OFFER</th>
        <th>TIME TO END</th>
      </tr>
      <tr v-for="auction in getPagedActiveAuctions.auctions" :key="auction._id" class="auction">
        <td @click="gotToAuction(auction._id)" class="auction-item auction-title">{{auction.title}}</td>
        <td class="auction-item auction-price">{{auction.price}}  pln</td>
        <td class="auction-item"> {{ auction.isBuyNow }}</td>
        <td v-if="auction.offers.length > 0" class="auction-item auction-offer-last-bider">
          {{auction.offers[auction.offers.length -1].issuerName}}
        </td>
        <td v-else class="auction-item">
          No offer yet
        </td>
        <td :id="auction._id" class="auction-item auction-countdown"></td>

      </tr>
    </table>
    <div class="home-pager">
      <a @click="goToPage(page+1)"
         class="home-pager-item"
         v-bind:class="{'home-pager-item-active': getPagedActiveAuctions.currentPage == (page+1)}"
         v-for="page in Array(getPagedActiveAuctions.totalPages).keys()"
         :key="page">
        {{page+1}}
      </a>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'Home',
  data () {
    return {
      intervalHandles: []
    }
  },
  methods: {
    ...mapActions(['fetchAuctions', "subscribeEvent", "unsubscribeEvent", "applyAuctionStateChange"]),
    gotToAuction: function (id) {
      this.$router.push({ path: `/auctions/${id}` })
    },
    goToPage: function (page) {
      this.intervalHandles.forEach(handle => window.clearInterval(handle));
      this.fetchAuctions({page}).then(() => this.attachTimer());
    },
    attachTimer: function(){
      this.getPagedActiveAuctions.auctions.forEach(auction => {
        if (!auction.expirationDate) {
          if(!auction.buyer){
            document.getElementById(auction._id).innerHTML = "------";
          } else {
            document.getElementById(auction._id).innerHTML = "finished";
          }
        } else {
          if (auction.isBuyNow && !!auction.buyer){
            document.getElementById(auction._id).innerHTML = "finished";
            return;
          }
          let intervalHandle = setInterval(() => {
            let countdown = Date.parse(auction.expirationDate) - Date.parse(new Date());
            if (countdown <= 0) {
              this.intervalHandles = this.intervalHandles.filter(handle => handle != intervalHandle);
              window.clearInterval(intervalHandle);
              document.getElementById(auction._id).innerHTML = "EXPIRED";
              return;
            }
            let seconds = Math.floor( (countdown/1000) % 60 );
            let minutes = Math.floor( (countdown/1000/60) % 60 );
            let hours =  Math.floor( (countdown/(1000*60*60)) % 24 );
            let days = Math.floor( countdown/(1000*60*60*24) );
            let deadlineCounter = `${days}d:${hours}h:${minutes}m:${seconds}s`;
            document.getElementById(auction._id).innerHTML = deadlineCounter;
          }, 1000);
          this.intervalHandles.push(intervalHandle);
        }
      });
    },
    handleBetEvent: function(data){
      this.applyAuctionStateChange(data.auction);
      this.intervalHandles.forEach(handle => window.clearInterval(handle));
      this.attachTimer();
    }
  },
  computed: mapGetters(["getPagedActiveAuctions", 'user']),
  created() {
    this.subscribeEvent({eventName: "auctionBet", handler: this.handleBetEvent})
    this.fetchAuctions({page: 1})
      .then(() => this.attachTimer());
  },
  destroyed(){
    this.intervalHandles.forEach(handle => window.clearInterval(handle));
    this.unsubscribeEvent("auctionBet")
  }
}
</script>

<style scoped lang="scss">

$border: 5px solid black;

  .home {
    border: 5px solid black;
    width: 80%;
    margin: auto;
    background-color: darkgrey;
    table {
      border-radius: 40px;
      width: 80%;
      margin-left:auto;
      margin-right:auto;
      background-color: antiquewhite;
      font-weight: bold;
      font-size: larger;
      th {
        margin-bottom: 30px;
        border-radius: 40px;
        height: 50px;
        border-radius: 40px;
        border-bottom: $border;
        border-top: $border;
      }
      th:first-child {
        border-left: $border;
      }
      th:last-child {
        border-right: $border;
      }
      td {
        border-radius: 40px;
        border: 3px solid grey;
      }
      tr {
        margin-bottom: 40px;
      }
      tr:nth-child(odd){
        background-color: white;
      }
      tr:first-child {
        background-color: #42b983;
      }
      td:first-child {
        &:hover {
          background-color: black;
          color: white;
          cursor: pointer;
          transition: .2s;
        }
      }
    }
  }

  .home-pager {
    display: inline-block;
    margin: 1%;

    &-item {
      font-weight: bolder;
      font-size: large;
      border-radius: 15px;
      float: left;
      padding: 12px 16px;
      text-decoration: none;
      border: 3px solid #ddd;
      color: black;
      background-color: darkkhaki;

      &:hover:not(.home-pager-item-active){
        background-color: #ddd;
        cursor: pointer;
        transition: .2s;
      }

      &-active {
        background-color: black;
        color: white;
        border: 3px solid black;
      }
    }
  }

</style>
