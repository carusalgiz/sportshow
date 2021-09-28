export const state = () => ({
  loginState: false,
  token: null,
  user: null,
  isAdmin: false,
  cart: null
})

export const mutations = {
  setLoginState(state, value) {
    state.loginState = value;
  },
  setToken(state, value) {
    state.token = value;
  },
  setCart(state, value) {
    state.cart = value
  },
  setUser(state, value) {
    state.user = value;
  },
  setIsAdmin(state, value) {
    state.isAdmin = value;
  },
}
export const getters = {
  getLoginState: (state) => {
    return state.loginState
  },
  getCart: (state) => {
    return state.cart
  },
  getUser: (state) => {
    return state.user
  },
  getToken: (state) => {
    return state.token
  },
  getIsAdmin: (state) => {
    return state.isAdmin
  },
}
