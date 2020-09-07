<template>
  <div class="auction-betting">
    <form @submit.prevent="onSubmit">
      <input type="number" v-model=offer>
      <button type="submit">BET</button>
    </form>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: 'AuctionBetting',
  data() {
    return {
      offer: 0,
    }
  },
  props: ["auction"],
  methods: {
    ...mapActions(["emitEvent", "subscribeEvent", "unsubscribeEvent"]),
    onSubmit: function() {
      if (this.offer < this.auction.price){
        alert("Invalid amount");
        return;
      }
      this.subscribeEvent({
        eventName: "auctionBetResult",
        handler: this.handleSubmitResponse
      });
      this.emitEvent({
        eventName: "placeOffer",
        data: {
          auctionId: this.auction._id,
          offer: this.offer
        }
      });
    },
    handleSubmitResponse: function(bettingResult) {
      if (bettingResult.successful === false){
        alert("Failed to place offer");
        console.log(bettingResult);
      }

      this.unsubscribeEvent("auctionBetResult");
    }
  },
  destroyed(){
    this.unsubscribeEvent("auctionBetResult");
  }
}
</script>
