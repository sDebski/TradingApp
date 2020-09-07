<template>
  <div class="buy-now-button">
    <button @click="buyNow">BUY NOW!</button>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  props: ["auction"],
  nam: 'BuyNow',
  methods: {
    ...mapActions(["emitEvent", "subscribeEvent", "unsubscribeEvent"]),
    buyNow: function() {
      this.subscribeEvent({
        eventName: "auctionBetResult",
        handler: this.handleSubmitResponse
      });
      this.emitEvent({
        eventName: "placeOffer",
        data: {
          auctionId: this.auction._id,
          offer: this.auction.price
        }
      });
    },
    handleSubmitResponse: function(bettingResult) {
      if (bettingResult.successful){
        alert("Offer placed");
      } else {
        alert("Failed to place offer");
      }
      this.unsubscribeEvent("auctionBetResult");
    }
  },
  destroyed(){
    this.unsubscribeEvent("auctionBetResult");
  }
}
</script>

<style lang="scss" scoped>

</style>
