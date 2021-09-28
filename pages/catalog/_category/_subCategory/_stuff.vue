<template>
  <div class="d-flex flex-column justify-center">
    <div class="page-header">
      <v-container class="d-flex flex-column justify-center">
        <h1>{{stuff.name}}</h1>
        <div class="breadcrumbs mt-3">
          <NuxtLink to="/" class="light-link"><span class="mr-5">Главная</span></NuxtLink>
          <NuxtLink to="/catalog" class="light-link"><span class="mr-5">Каталог</span></NuxtLink>
          <NuxtLink :to="'/catalog/' + breadcrumbs.category.link" class="light-link">
            <span class="mr-5">{{breadcrumbs.category.name}}</span>
          </NuxtLink>
          <NuxtLink :to="'/catalog/' + breadcrumbs.category.link + '/' + breadcrumbs.subCategory.link" class="light-link">
            <span class="mr-5">{{breadcrumbs.subCategory.name}}</span>
          </NuxtLink>
        </div>
      </v-container>
    </div>
    <div class="page-main">
      <v-container>
        <div class="d-md-flex d-lg-flex">
          <div class="img-item mr-md-10 mr-lg-10 mb-4 mt-3" v-bind:class="{'empty':stuff.picture == null}">
            <transition name="fade">
              <div class="discount-block d-flex align-center justify-center"
                   v-if="stuff.discount > 0 || addToCartData.option.discount > 0">
                <h2 class="mb-0">
                  <b>-{{stuff.discount > addToCartData.option.discount ? stuff.discount : addToCartData.option.discount}}%</b>
                </h2>
              </div>
            </transition>
            <v-img
              :src="stuff.picture != null ? env + stuff.picture : ''"
              max-height="400"
              contain
            ></v-img>
          </div>
          <div class="d-flex flex-column">
            <h1 class="mt-5 mb-4 name">{{stuff.name}}</h1>
            <div class="d-flex align-center" v-if="stuff.categories.length > 0">
              <div class="option-block">
                <v-select
                  v-if="stuff.categories.length > 1"
                  :items="stuff.categories"
                  v-model="addToCartData.option"
                  item-text="option"
                  item-value="id"
                  hide-details
                  return-object
                  solo
                  class="mr-3 mt-2 mb-2 custom-select"
                >
                </v-select>
                <h3 v-else>{{addToCartData.option.option}}</h3>
              </div>
              <div class="ml-md-10 ml-lg-10 ml-5 price d-flex">
                <span v-bind:class="{'discount': addToCartData.option.discount > 0 || stuff.discount > 0}">
                  <b>{{addToCartData.option.price}} P</b>
                </span>
                <template v-if="addToCartData.option.discount > 0 || addToCartData.option.discount > 0">
                  <span class="green--text ml-4">{{itemPrice}} P</span>
                </template>
              </div>
            </div>
            <span><b>Код товара:</b> {{addToCartData.option.code}}</span>
            <div class="count-block pa-3 mt-7">
              <div class="d-flex align-center mt-2">
                <v-btn-toggle class="w-100">
                  <v-btn color="secondary" @click="removeCount" class="custom-button"><v-icon class="white--text">mdi-minus</v-icon></v-btn>
                  <!--                <v-text-field outlined class="text-center" v-model="addToCartData.count"></v-text-field>-->
                  <input class="text-center count-input" v-model="addToCartData.count">
                  <v-btn color="secondary" @click="addCount" class="custom-button"><v-icon class="white--text">mdi-plus</v-icon></v-btn>
                </v-btn-toggle>

              </div>
              <div class="mt-5 w-100">
                <v-btn dark @click="addToCart" class="w-100 add-cart-btn"
                       color="pink"
                       >Добавить в корзину</v-btn>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-7">
          <p v-if="stuff.description != null">{{stuff.description}}</p>
        </div>
      </v-container>

    </div>
  </div>
</template>

<script>
  import {age, categories, flavor} from "../../../../static/data";
    import {environment} from "../../../../assets/environment";

    export default {
      auth: false,
      name: "Stuff",
      head() {
        return {
          title: this.stuff.name,
          meta: [
            {
              description: this.stuff.description
            }
          ]
        }
      },
      data() {
        return {
          ages: age,
          flavors: flavor,
          addToCartData: {
            count: 1,
            option: {
              option: '',
              price: 0
            }
          },
          stuff: {
            age: null,
            flavor: null,
            producer: null,
            name: '',
            description: '',
            code: 0,
            discount: 0,
            picture: null,
            section: '',
            subsection: '',
            categories: []
          },
          loading: false,
          env: environment.api,
          breadcrumbs: {
            category: {
              name: '',
              link: '',
              subs: []
            },
            subCategory: {
              name: '',
              link: '',
              subs: []
            }
          }
        }
      },
      mounted() {

        this.breadcrumbs.category = categories.filter(cat => cat.link === this.$route.params.category)[0];
        this.breadcrumbs.subCategory = categories.filter(cat => cat.link === this.$route.params.category)[0].subs.filter(subCat =>
          subCat.link === this.$route.params.subCategory)[0];
        this.loading = true;
        this.$axios.get(`${environment.api}/catalog/${this.$route.params.category}/${this.$route.params.subCategory}/${this.$route.params.stuff}`
        ).then( res => {
          this.stuff = {
            ...res.data
          };
          this.addToCartData.count = 1;
          this.addToCartData.option = this.stuff.categories != null ?
                  this.stuff.categories.length > 0 ?
                    this.$route.query.id != null ? this.stuff.categories.filter(opt => opt.id == this.$route.query.id)[0] : this.stuff.categories[0] : null : null;
        }, (err) => {
          this.checkError(err.response);
          this.loading = false;
        })
      },
      methods: {
        addCount() {
          this.addToCartData.count++;
        },
        removeCount() {
          if (this.addToCartData.count !== 0) {
            this.addToCartData.count--;
          }
        },
        addToCart() {
          let cart = localStorage.getItem('cart') != null ? JSON.parse(localStorage.getItem('cart')) : [];
          const option = this.stuff.categories.filter(option => option === this.addToCartData.option)[0]
          cart.push({
            data: {
              id: this.stuff.id,
              name: this.stuff.name,
              picture: this.stuff.picture,
              producer: this.stuff.producer,
              discount: this.stuff.discount,
              flavor: this.stuff.flavor,
              age: this.stuff.age
            },
            option: option,
            count: this.addToCartData.count,
            path: `${this.$route.path}?id=${option.id}`
          })
          localStorage.setItem('cart', JSON.stringify(cart));
          this.$store.commit('setCart', cart);
        },
        checkError(error) {
          if (error.status === 401 || error.status === 403) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            this.$store.commit('setLoginState', false);
            this.$store.commit('setIsAdmin', false);
            this.$store.commit('setUser', null);
          }
        }
      },
      computed:{
        itemPrice() {
          if (this.stuff.discount < this.addToCartData.option.discount) {
            if (this.addToCartData.option.discount > 0) {
              return (this.addToCartData.option.price - ((this.addToCartData.option.price / 100) * this.addToCartData.option.discount)).toFixed(2)
            } else {
              return this.addToCartData.option.price
            }
          } else {
            if (this.stuff.discount > 0) {
              return (this.addToCartData.option.price - ((this.addToCartData.option.price / 100) * this.stuff.discount)).toFixed(2)
            } else {
              return this.addToCartData.option.price
            }
          }
        }
      }
    }
</script>

<style scoped lang="scss">
  @import "~/assets/catalog.scss";
  @import "~/assets/default.scss";
  .discount-block{
    position: absolute;
    width: 70px;
    height: 70px;
    border-radius: 35px;
    background-color: #e91e63;
    color: white;
    z-index: 5;
    transform: rotate(-15deg);
  }
  .page-header{
    h1{
      font-family: 'Montserrat Light', sans-serif;
      line-height: 2rem;
    }
  }
  .page-main{
    h1{
      font-family: 'Montserrat Light', sans-serif;
      line-height: 2rem;
    }
  }
  .img-item{
    width: 400px;
    height: 400px;
    &.empty{
      background-color: #f7f7f7;
    }
  }
  .option-block{
    width: 230px;
  }
  .count-block{
    background-color: #f7f7f7;
    width: 230px;
  }
  .count-input{
    border-top: 1px solid lightgray;
    border-bottom: 1px solid lightgray;
    width: 100%;
  }
  .custom-button{
    height: 35px !important;
    padding: 0 !important;
    width: 35px !important;
    min-width: unset !important;
  }
  .breadcrumbs span{
    white-space: nowrap;
  }
  .price{
    font-size: 1.5rem;
    font-family: "Montserrat Bold", sans-serif;
    .discount{
      text-decoration: line-through;
    }
  }
  .fade-enter-active, .fade-leave-active {
    transition: .2s;
    transform: translateX(0);
  }
  .fade-enter, .fade-leave-to{
    opacity: 0;
    transform: translateX(-10px);
  }
  @media all and (max-width: 960px) {
    .option-block{
      width: 50%;
    }
    .count-block{
      width: 100%;
    }
    .price{
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      flex-grow: 1;
    }
    .custom-button{
      height: 50px !important;
      width: 50px !important;
    }
    .add-cart-btn{
      height: 50px !important;
    }
    .img-item{
      width: 100%;
    }
    .name{
      font-size: 1.5rem;
    }
  }
</style>
