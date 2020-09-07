import io from "socket.io-client";

const SOCKET_PATH = "/"
const state = {
  socket: io.connect(SOCKET_PATH),
}

const getters = {
  isSocketConnected: state => state.socket.connected && !!state.socket
}

const actions = {
  emitEvent({state}, {eventName, data}){
    state.socket.emit(eventName, data);
  },
  connectSocket({state}) {
    if (!state.isSocketConnected)
      state.socket.connect(SOCKET_PATH)
  },
  disconnectSocket({state, getters}) {
    if(getters.isSocketConnected)
      state.socket.disconnect()
  },
  reconnectSocket({getters, state}){
    if(getters.isSocketConnected)
      state.socket.disconnect()
    state.socket.connect(SOCKET_PATH)
  },
  subscribeEvent({state}, {eventName, handler}){
    state.socket.on(eventName, handler)
  },
  unsubscribeEvent({state}, eventName) {
    state.socket.off(eventName)
  },
  unsubscribeExactEvent({state}, {eventName, handler}) {
    state.socket.off(eventName, handler)
  }
}

export default {
  state,
  getters,
  actions,
}
