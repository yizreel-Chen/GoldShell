const app = {
  state: {
    token: null,
    isLogin: false,
    language: '',
    algo: null,
    minerInfo: {}
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_IS_LOGIN: (state, isLogin) => {
      state.isLogin = isLogin
    },
    SET_LANGUAGE: (state, language) => {
      state.language = language
    },
    SET_ALGO: (state, algo) => {
      state.algo = algo
    },
    SET_MINER_INFO: (state, minerInfo) =>{
      state.minerInfo = minerInfo
    }
  },
  actions: {
    setToken({
      commit
    }, token) {
      commit('SET_TOKEN', token)
    },
    setIsLogin({commit}, isLogin){
      commit('SET_IS_LOGIN', isLogin)
    },
    setLanguage({commit}, language){
      commit('SET_LANGUAGE', language)
    },
    setAlgo({commit}, algo){
      commit('SET_ALGO', algo)
    },
    setMinerInfo({commit}, minerInfo){
      commit('SET_MINER_INFO', minerInfo)
    }
  }
}

export default app