import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    transcoding: false,
    transcodings: [],
  },
  mutations: {
    transcodingOn(state) {
      state.transcoding = true
    },
    transcodingOff(state) {
      state.transcoding = false
    },
    transcodingsAdd(state, payload) {
      payload.progress = ''
      state.transcodings.push(payload)
    },
    transcodingsSetPending(state, id) {
      let i = state.transcodings.map(item => parseInt(item.id)).indexOf(parseInt(id))
      state.transcodings[i].progress = ''
    },
    transcodingsSetProgress(state, payload) {
      let i = state.transcodings.map(item => parseInt(item.id)).indexOf(parseInt(payload.id))
      let progress = Math.floor((payload.frame * 100) / state.transcodings[i].frames) + '%'
      if (payload.pass > 0) {
        progress += ' (pass ' + payload.pass + '/2)'
      }
      state.transcodings[i].progress = progress
    },
    transcodingsSetUnpublished(state, id) {
      let i = state.transcodings.map(item => parseInt(item.id)).indexOf(parseInt(id))
      state.transcodings[i].progress = 'unpublished'
    },
    transcodingsRemove(state, id) {
      let i = state.transcodings.map(item => parseInt(item.id)).indexOf(parseInt(id))
      state.transcodings.splice(i, 1)
    },
    transcodingsFail(state, id) {
      let i = state.transcodings.map(item => parseInt(item.id)).indexOf(parseInt(id))
      state.transcodings[i].progress = 'failed'
    },
  },
  actions: {
  },
  modules: {
  },
})