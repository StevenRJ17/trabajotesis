import { createStore } from 'vuex'

export default createStore({
  state: {
    isAuthenticated: !!localStorage.getItem('x-token'),
    userData: JSON.parse(localStorage.getItem('user-data')) || null
  },
  mutations: {
    setAuthenticated(state, value) {
      state.isAuthenticated = value
    },
    setUserData(state, data) {
      state.userData = data
      if (data) {
        localStorage.setItem('user-data', JSON.stringify(data))
      } else {
        localStorage.removeItem('user-data')
        
      }
    }
  },
  actions: {
    login({ commit }, userData) {
      commit('setAuthenticated', true)
      commit('setUserData', userData)
    },
    logout({ commit }) {
      commit('setAuthenticated', false)
      commit('setUserData', null)
    }
  },
  getters: {
  },
  modules: {
  }
})
