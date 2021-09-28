<template>
  <div>
    <h2>Заказы</h2>
    <div class="d-flex align-end mb-5">
      <v-select
        hide-details
        style="width: 200px;max-width: 200px;"
        :items="statuses" v-model="filter.state" item-text="name" item-value="value" label="Статус заказа"></v-select>
      <v-btn @click="loadOrders" class="ml-3">Обновить список</v-btn>
    </div>
    <div class="d-flex justify-center" v-if="ordersLoading">
      <v-progress-circular indeterminate color="pink"></v-progress-circular>
    </div>
    <v-list dense v-else>
      <v-list-item v-for="(item,index) of order" :key="index">
        <order-item :model="item"></order-item>
      </v-list-item>
    </v-list>
    <div class="text-center">
      <v-pagination
        v-model="pagination.page"
        :length="pagination.totalPages"
        @input="loadOrders"
      ></v-pagination>
    </div>
  </div>
</template>

<script>
    import OrderItem from "../../../components/admin/orderItem";
    import {environment} from "../../../assets/environment";
    import {STATE_CHOICES} from "static/data";
    export default {
      layout: 'admin',
      name: "index",
      components: {OrderItem},
      data() {
        return {
          filter: {
            state: null
          },
          statuses: STATE_CHOICES,
          pagination: {
            page: 1,
            count: 0,
            limit: '15',
            totalPages: 0
          },
          order: [],
          ordersLoading: false
        }
      },
      methods: {
        loadOrders() {
          this.ordersLoading = true;
          let filter = '';
          if (this.filter.state) {
            filter = `&state=${this.filter.state}`
          }
          this.$axios.get(`${environment.api}/admin/order?page=${this.pagination.page}&limit=${this.pagination.limit}${filter}`, {headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }}).then( (result) => {
            this.order = result.data.results;
            this.pagination.count = result.data.count;
            this.pagination.totalPages = result.data.total_pages;
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
        this.loadOrders();
        this.statuses.push({value: '', name: 'Все'});
      }
    }
</script>

<style scoped lang="scss">
  @import "~/assets/default.scss";
  .content__list-wrapper{
    border-radius: 7px;
    border: 1px solid lightgray;
    padding: 5px 10px;
  }
</style>
