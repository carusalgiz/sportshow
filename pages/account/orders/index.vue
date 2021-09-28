<template>
  <div class="d-flex flex-column justify-center">
    <div class="page-header">
      <v-container class="d-flex justify-space-between align-center">
        <h1>Личный кабинет</h1>
      </v-container>
    </div>
    <v-container class="page-main">
      <div class="d-md-flex d-lg-flex" v-if="loggedIn">
        <AccountMenu></AccountMenu>
        <div class="main-content">
          <h2>Заказы</h2>
          <div class="d-flex justify-center" v-if="ordersLoading">
            <v-progress-circular indeterminate color="pink"></v-progress-circular>
          </div>
          <div class="content__list-wrapper" v-else>
            <v-list class="content__item-wrapper" dense v-for="(item,index) of order.results" :key="index">
              <orders-page-item :order="item"></orders-page-item>
            </v-list>
          </div>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>
  // import {environment} from "../assets/environment";
  import AccountMenu from "../../../components/accountMenu";
  import {mapGetters} from "vuex";
  import {environment} from "../../../assets/environment";
  import OrdersPageItem from "../../../components/ordersPageItem";

  export default {
    components: {OrdersPageItem, AccountMenu},
    auth: false,
    name: "Orders",
    data() {
      return {
        user: null,
        loggedIn: false,
        order: {
          results: [],
          count: 0
        },
        ordersLoading: false
      }
    },
    methods: {
      ...mapGetters(['getLoginState', 'getUser']),
      getOrders() {
        this.ordersLoading = true;
        this.$axios.get(`${environment.api}/order`, {headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }}).then( (result) => {
            this.order = result.data;
            this.ordersLoading = false;
        }, (err) => {
          this.checkError(err.response);
          this.ordersLoading = false;
        });
      },
      checkError(error) {
        if (error.status === 401 || error.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          this.$store.commit('setLoginState', false);
          this.$store.commit('setIsAdmin', false);
          this.$store.commit('setUser', null);
          this.$router.push('/');
        }
      }
    },
    mounted() {
      this.user = this.getUser();
      this.loggedIn = this.getLoginState();
      this.$store.subscribe((mutation, state) => {
        if (mutation.type === 'setLoginState') {
          this.loggedIn = state.loginState;
        }
        if (mutation.type === 'setUser') {
          this.user = state.user;
        }
      })
      this.getOrders();
    }
  }
</script>

<style scoped lang="scss">
  @import "~/assets/default.scss";

  .page-header {
    h1 {
      font-family: 'Montserrat Light', sans-serif;
    }
  }

  .menu {
    width: 20%;
    min-width: 250px;
    margin-right: 50px;

    span {
      font-family: 'Montserrat Bold', sans-serif;

      &.active, &:hover {
        color: deeppink;
        cursor: pointer;
      }
    }
  }

  .main-content {
    width: 80%;
  }

  .content__list-wrapper{
    border-radius: 7px;
    border: 1px solid lightgray;
    padding: 5px 10px;
    .content__item-wrapper {

    }
  }
</style>
