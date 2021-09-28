<template>
  <div class="d-flex flex-column justify-center">
    <div class="page-header">
      <v-container class="d-flex justify-space-between align-center">
        <h1>Корзина</h1>
      </v-container>
    </div>
    <div class="page-main">
      <v-container>
        <div v-if="cart.length !== 0 && !orderSucceed">
          <div class="d-none d-sm-none d-md-flex d-lg-flex">
            <v-simple-table class="cart-table w-100">
              <template v-slot:default>
                <thead>
                <tr>
                  <th style="width: 55%" class="pl-8 pt-5 pb-5">
                    <b>Товар</b>
                  </th>
                  <th style="width: 15%" class="pt-5 pb-5 text-center">
                    <b>Цена</b>
                  </th>
                  <th style="width: 10%" class="pt-5 pb-5 text-center">
                    <b>Кол-во</b>
                  </th>
                  <th style="width: 15%" class="pt-5 pb-5 text-center">
                    <b>Всего</b>
                  </th>
                  <th style="width: 5%" class="pt-5 pb-5 pr-8 text-center"></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) of cart" :key="'cartItem' + index">
                  <td style="width: 55%" class="pl-8 pt-6 pb-6">
                    <div class="d-flex align-center">
                      <div class="image-container" v-bind:class="{'empty': item.data.picture == null}">
                        <v-img :src="item.data.picture != null ? env + item.data.picture : ''"
                               max-width="100"
                               max-height="80"
                               contain
                               class="mr-5"></v-img>
                      </div>
                      <div class="d-flex flex-column">
                        <NuxtLink :to="item.path">{{item.data.name}}</NuxtLink>
                        <span class="text-secondary">{{item.option.option}}</span>
                      </div>

                    </div>
                  </td>
                  <td style="width: 15%" class="pt-6 pb-6 text-center number">{{getItemPrice(item)}}</td>
                  <td style="width: 10%" class="pt-6 pb-6 text-center number">
                    <div class="d-flex align-center">
                      <v-btn color="primary" :disabled="item.count === 0"
                             icon outlined fab x-small @click="removeCount(item)"><v-icon>mdi-minus</v-icon></v-btn>
                      <span class="ml-3 mr-3">{{item.count}}</span>
                      <v-btn color="primary" icon outlined fab x-small @click="addCount(item)"><v-icon>mdi-plus</v-icon></v-btn>
                    </div>
                  </td>
                  <td style="width: 15%" class="pt-6 pb-6 text-center number">{{getItemPrice(item) * item.count}} Р</td>
                  <td style="width: 5%" class="pt-6 pb-6 pr-8 text-center">
                    <v-btn fab @click="removeItem(index)"
                           outlined
                           dark
                           x-small color="error"><v-icon>mdi-close</v-icon></v-btn>
                  </td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
          </div>

          <div class="d-flex d-sm-flex d-md-none d-lg-none flex-column">
            <v-card v-for="(item, index) of cart" :key="'cartItem' + index" class="mb-3">
              <div class="d-flex justify-center mt-2" v-bind:class="{'empty': item.data.picture == null}">
                <v-img :src="item.data.picture != null ? env + item.data.picture : ''"
                       max-height="130"
                       contain
                       class="mr-5"></v-img>
              </div>
              <div class="pl-4 mt-2 code">Код товара: {{item.data.code}}</div>
              <v-card-title class="pt-1">
                <NuxtLink :to="item.path" class="name">{{item.data.name}} {{item.option.option}}</NuxtLink>
              </v-card-title>
              <v-card-text>
                <div class="d-flex justify-space-between">
                  <div class="d-flex align-center">
                    <v-btn color="primary" :disabled="item.count === 0"
                           icon outlined fab x-small @click="removeCount(item)"><v-icon>mdi-minus</v-icon></v-btn>
                    <span class="ml-3 mr-3 option">{{item.count}}</span>
                    <v-btn color="primary" icon outlined fab x-small @click="addCount(item)"><v-icon>mdi-plus</v-icon></v-btn>
                  </div>
                  <span class="option">{{getItemPrice(item)}} Р</span>
                </div>
                <div class="d-flex justify-center mt-4">
                  <v-btn @click="removeItem(index)"
                         outlined
                         color="pink">Удалить</v-btn>
                </div>


              </v-card-text>
            </v-card>
          </div>
          <div class="d-flex justify-space-between">
            <div class="d-flex flex-column pt-5">
              <h4>Способ доставки:</h4>
              <v-radio-group
                v-model="deliveryType"
                column
              >
                <v-radio
                  label="Самовывоз"
                  color="red"
                  value="SELF"
                ></v-radio>
                <v-radio
                  label="Доставка"
                  color="red"
                  value="DELIVERY"
                ></v-radio>
              </v-radio-group>
            </div>
            <div class="d-flex flex-column">
              <div class="d-flex justify-end mt-5" v-if="deliveryType === 'DELIVERY'">
                <h3 style="color: gray">{{freeShipping ?
                  'У вас бесплатная доставка' : 'Ваш заказ меньше 1500р, стоимость доставки будет стоить 200р'}}</h3>
              </div>
              <div class="d-flex justify-end full-price" v-if="deliveryType === 'DELIVERY'">
                <span class="mr-3">Доставка:</span>
                <span>{{freeShipping || deliveryType === 'SELF' ? 'Бесплатно' : '200 Р'}}</span>
              </div>
              <div class="d-flex justify-end full-price pt-5">
                <span class="mr-3">Сумма заказа:</span>
                <span>{{Number.parseFloat(fullCount)}} Р</span>
              </div>
              <div class="d-flex justify-end full-price">
                <span class="mr-3">Итого:</span>
                <span>{{freeShipping || deliveryType === 'SELF' ?
                  Number.parseFloat(fullCount) : Number.parseFloat(fullCount) + 200}} Р</span>
              </div>
            </div>
          </div>

          <h1 class="mb-5 mt-10 text-center">Данные для оформления заказа</h1>
          <h3 class="blue--text mb-4" v-if="!getUserFunc()">Для совершения заказа необходимо войти в свою учетную запись</h3>
          <v-form v-model="checkoutValid" @submit.prevent="makeOrder">
            <v-row>
              <v-col cols="12" sm="6" md="6" lg="6" class="pb-0 pt-0">
                <v-text-field
                  label="Ваше имя *"
                  required
                  :rules="nameRules"
                  filled
                  class="rounded-lg"
                  rounded
                  v-model="checkoutForm.name"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6" lg="6" class="pb-0 pt-0">
                <v-text-field
                  label="Ваш телефон *"
                  :rules="phoneRules"
                  required
                  filled
                  rounded
                  class="rounded-lg"
                  v-mask="'# (###) ### ##-##'"
                  prefix="+"
                  v-model="checkoutForm.phone"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4" md="4" lg="4" class="pb-0 pt-0">
                <v-text-field
                  label="Ваш email *"
                  :rules="emailRules"
                  required
                  filled
                  class="rounded-lg"
                  rounded
                  v-model="checkoutForm.email"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="8" md="8" lg="8" class="pb-0 pt-0">
                <v-text-field
                  v-if="deliveryType !== 'SELF'"
                  required
                  label="Ваш адрес *"
                  :rules="addressRules"
                  filled
                  rounded
                  class="rounded-lg"
                  v-model="checkoutForm.address"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-textarea
              label="Дополнительная информация"
              required
              filled
              class="rounded-lg"
              rounded
              v-model="checkoutForm.info"
            ></v-textarea>
            <span>* - поля, обязательные для заполнения</span>

              <div class="d-flex flex-column w-100 justify-end mt-4 align-end">
                <div class="d-flex flex-column pt-5">
                  <h4>Способ оплаты:</h4>
                  <v-radio-group
                    v-model="payType"
                    column
                  >
                    <v-radio
                      label="Оплата наличными"
                      color="red"
                      value="CASH"
                    ></v-radio>
                    <v-radio
                      label="Оплата картой"
                      color="red"
                      value="NONCASH"
                    ></v-radio>
                    <v-radio
                      label="Онлайн"
                      color="red"
                      value="ONLINE"
                    ></v-radio>
                  </v-radio-group>
                </div>
                <v-btn type="submit"
                       large
                       :color="(checkoutValid && getUserFunc() != null) ? 'pink' : 'primary'"
                       :dark="checkoutValid && getUserFunc() != null"
                       :disabled="!checkoutValid || getUserFunc() == null"
                       tile>Оформить заказ</v-btn>
              </div>

          </v-form>
        </div>

        <div v-if="cart.length === 0 && !orderSucceed" class="d-flex w-100 justify-center">
          <h2>В корзине отсутствуют товары</h2>
        </div>
        <div v-if="orderSucceed" class="d-flex flex-column w-100 justify-center align-center">
          <h2 class="mb-5">Ваш заказ принят в обработку</h2>
          <div v-if="message">{{message}}</div>
          <v-btn v-if="order.pay_state === 'NOT_PAYED' && order.pay_type === 'ONLINE'" color="success" @click="payOrder()">Перейти к оплате заказа</v-btn>
        </div>
      </v-container>
    </div>
  </div>
</template>

<script>
    import {environment} from "../assets/environment";
    import {mapGetters} from "vuex";

    export default {
      auth: false,
      name: "cart",
      data() {
          return {
            cart: [],
            env: environment.api,
            checkoutValid: false,
            checkoutForm: {
              name: '',
              email: '',
              phone: '7',
              address: '',
              info: ''
            },
            addressRules: [
              v => !!v || 'Заполните ваш адрес'
            ],
            nameRules: [
              v => !!v || 'Заполните ваше имя'
            ],
            phoneRules: [
              v => !!v || 'Заполните ваш телефон'
            ],
            emailRules: [
              v => !!v || 'Заполните ваш электронный адрес',
              v => /.+@.+/.test(v) || 'Проверьте правильность написания email',
            ],
            fullPrice: 0,
            deliveryType: 'SELF',
            payType: 'ONLINE',
            orderSucceed: false,
            order: null,
            message: null
          }
      },
      methods: {
        ...mapGetters(['getUser']),
        getItemPrice(item) {
          if (item.data.discount < item.option.discount) {
            if (item.option.discount > 0) {
              return (item.option.price - ((item.option.price / 100) * item.option.discount)).toFixed(2)
            } else {
              return Number.parseFloat(item.option.price).toFixed(2)
            }
          } else {
            if (item.data.discount > 0) {
              return (item.option.price - ((item.option.price / 100) * item.data.discount)).toFixed(2)
            } else {
              return Number.parseFloat(item.option.price).toFixed(2)
            }
          }
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
            this.message = '';
            for (const errorKey in err.response.data) {
              if (err.response.data.hasOwnProperty(errorKey)) {
                for (const errorValue of err.response.data[errorKey]) {
                  this.message += errorValue + '; \n';
                }
              }
            }
          });
        },
        addCount(item) {
          item.count++;
          this.fullPrice = (Number.parseFloat(this.fullPrice) + Number.parseFloat(this.getItemPrice(item))).toFixed(2);
          localStorage.setItem('cart', JSON.stringify(this.cart));
          this.$store.commit('setCart', this.cart);
        },
        removeCount(item) {
          if (item.count !== 0) {
            item.count--;
            this.fullPrice = (this.fullPrice - this.getItemPrice(item)).toFixed(2);
            localStorage.setItem('cart', JSON.stringify(this.cart));
            this.$store.commit('setCart', this.cart);
          }
        },
        removeItem(index) {
          this.cart.splice(index, 1);
          localStorage.setItem('cart', JSON.stringify(this.cart));
          this.$store.commit('setCart', this.cart);
        },
        getUserFunc() {
          return this.getUser()
        },
        makeOrder() {
          const body = {
            user: this.$store.state.user.pk,
            ...this.checkoutForm,
            goods: this.cart,
            delivery_type: this.deliveryType,
            pay_type: this.payType,
            state: 'NEW'
          };
          body.phone = body.phone.replaceAll(' ', '')
            .replace('-', '')
            .replace('(', '')
            .replace(')', '');
          this.$axios.$post(`${environment.api}/order`, body, {headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }}).then( (result) => {
              this.order = result;
              this.cart = [];
              localStorage.removeItem('cart');
              this.$store.commit('setCart', null);
              this.orderSucceed = true;
          }, (err) => {
            this.message = '';
            for (const errorKey in err.response.data) {
              if (err.response.data.hasOwnProperty(errorKey)) {
                for (const errorValue of err.response.data[errorKey]) {
                  this.message += errorValue + '; \n';
                }
              }
            }
            this.checkError(err.response);
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
        },
        updateUserInfo() {
          const user = this.getUser();
          if (user) {
            this.checkoutForm.name = user.first_name;
            this.checkoutForm.email = user.email;
            this.checkoutForm.phone = user.username;
          }
        }
      },
      mounted() {
        this.updateUserInfo();
        this.$store.subscribe((mutation, state) => {
          if (mutation.type === 'setLoginState') {
            this.updateUserInfo();
          }
        });
        this.cart = localStorage.getItem('cart') != null ? JSON.parse(localStorage.getItem('cart')) : [];
        for (let item of this.cart) {
          this.fullPrice += this.getItemPrice(item) * item.count;
        }
        this.fullPrice = Number.parseFloat(this.fullPrice).toFixed(2)
      },
      computed: {
        fullCount() {
          return this.cart != null ? this.cart.reduce( (sum, elem) => {
            let max_discount = 0;
            if (elem.data.discount > elem.option.discount) {
              max_discount = elem.data.discount
            } else {
              max_discount = elem.option.discount;
            }
            let price  = elem.option.price - ((elem.option.price / 100) * max_discount)

            return sum + (elem.count * price)
          },0).toFixed(2) : 0;
        },
        freeShipping() {
          return this.fullCount > 1500;
        }
      }
    }
</script>

<style scoped lang="scss">
  @import "~/assets/catalog.scss";
  @import "~/assets/default.scss";
  .image-container{
    width: 100px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    &.empty{
      background-color: #f7f7f7;
    }
  }
  .full-price{
    font-size: 1.3rem;
    & span:first-child{
      font-family: "Montserrat Regular", sans-serif;
    }
    & span:last-child{
      font-family: "Montserrat Bold", sans-serif;
    }
  }
  .page-header{
    h1{
      font-family: 'Montserrat Light', sans-serif;
    }
  }
  .cart-table {
    box-shadow: 0 0 15px 2px lightgray;
    font-family: 'Montserrat', sans-serif;
    thead{
      font-family: 'Montserrat Bold', sans-serif;
      box-shadow: 0 2px 7px 1px lightgrey;
      th{
        font-size: 1.1rem !important;
      }
    }
    tbody{
      td{
        font-size: 1rem !important;
        color: black;
        &.number{
          font-family: 'Montserrat Bold', sans-serif;
        }
        a{
          text-decoration: none;
          color: black;
          transition: .2s;
          &:hover{
            color: dodgerblue;
          }
        }
      }
      tr:hover{
        cursor: default;
        background-color: initial !important;
      }
    }
  }
  @media all and (max-width: 960px) {
    .option{
      font-family: "Montserrat Bold", sans-serif;
      font-size: 1rem;
    }
    .code{
      font-size: 0.9rem;
    }
    .name{
      line-height: 1.5rem;
      font-size: 1.2rem;
      color: black;
    }
  }
</style>
