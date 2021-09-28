<template>
  <v-list-group :value="false" class="order-item w-100">
    <template v-slot:activator>
      <v-list-item-content>
        <v-list-item-title class="d-flex align-center justify-space-between">
          <div class="d-flex flex-column">
            <span>Заказ №{{order.id}}</span>
            <span>{{transformDate(order.add_date)}}</span>
          </div>
          <div class="d-flex flex-column" style="width: 260px">
            <div class="d-flex justify-space-between w-100">
              <span class="mr-3">Статус заказа:</span>
              <h3 class="purple--text mb-0">{{order_state}}</h3>
            </div>
            <div class="d-flex justify-space-between w-100">
              <span class="mr-3">Статус оплаты:</span>
              <h3 class="purple--text mb-0">{{pay_state}}</h3>
            </div>
          </div>

        </v-list-item-title>
      </v-list-item-content>
    </template>

    <v-list-item v-for="(item,index) of order.goods" :key="index">
      <v-row>
        <v-col cols="12" md="10" sm="10" lg="10">
          <div class="d-flex flex-column">
            <span><b>{{item.data.name}}</b></span>
            <span>Код товара: {{item.data.code}} • {{item.option.option}}</span>
          </div>
        </v-col>
        <v-col cols="12" md="2" sm="2" lg="2">
          <div class="d-flex flex-column">
            <span class="green--text">{{item.option.price}}</span>
            <span>{{item.count}} шт</span>
          </div>
        </v-col>
      </v-row>
    </v-list-item>
    <div class="d-flex flex-column justify-center align-end mt-2 order-footer">
      <div class="d-flex"><span class="mr-2 black--text">Итого:</span><h3 class="mb-0 green--text"><b>{{fullCount()}}</b></h3></div>
      <v-btn v-if="order.pay_state === 'NOT_PAYED' && order.pay_type === 'ONLINE'" color="success" small @click="payOrder()">Оплатить</v-btn>
    </div>
  </v-list-group>
</template>

<script>
    import {environment} from "assets/environment";
    import {PAY_STATE, STATE_CHOICES} from "static/data";

    export default {
      props: ['order'],
      name: "ordersPageItem",
      data() {
        return{
          statuses: STATE_CHOICES,
          pay_statuses: PAY_STATE,
          pay_state: '',
          order_state: ''
        }
      },
      methods: {
        transformDate(date) {
          return this.$moment(date).format('DD.MM.YYYY hh:mm:ss')
        },
        fullCount() {
          return this.order.goods.reduce( (sum, elem) => {
            let max_discount = this.order.discount;
            if (elem.data.discount > max_discount) max_discount = elem.data.discount;
            if (elem.option.discount > max_discount) max_discount = elem.option.discount;

            let price  = elem.option.price - ((elem.option.price / 100) * max_discount)

            return sum + (elem.count * price)
          },0).toFixed(2);
        },
        payOrder() {
          this.$axios.$post(`${environment.api}/pay`, {
            order: this.order.id,
            return_url: document.location.href
          }, {headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }}).then( (result) => {
              document.location.href = result;
          }, (err) => {
            console.log(err);
          });
        }
      },
      mounted() {
        const orState = this.statuses.filter(elem => elem.value === this.order.state);
        const payState = this.pay_statuses.filter(elem => elem.value === this.order.pay_state);
        this.order_state = orState.length > 0 ? orState[0].name : '';
        this.pay_state = payState.length > 0 ? payState[0].name : '';
      }
    }
</script>

<style scoped lang="scss">
  @import "../assets/default.scss";

  .order-item{
    border: 1px solid lightgray;

    .order-footer{
      background-color: #eeeeee;
      padding: 10px;
    }
  }
</style>
