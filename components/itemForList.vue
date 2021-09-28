<template>
  <v-card
    elevation="2"
    class="h-100 d-flex flex-column"
    v-bind:class="{'item-for-list': listType === 'list'}"
  >
    <v-card-text class="d-flex flex-grow-1" v-bind:class="{'flex-column': listType === 'grid'}"
    v-bind:style="{'padding': listType === 'grid' ? '16px' : '10px'}">
      <div class="img-container"
           v-bind:class="{
            'empty': item.picture == null,
            'grid': listType === 'grid',
            'mb-3': listType === 'grid'}">
        <NuxtLink :to="path + '/' + item.slug">
          <v-img
            contain
            :max-height="listType === 'grid' ? 200 : 70"
            :src="item.picture != null ? env + item.picture : ''"
          ></v-img>
        </NuxtLink>
      </div>
      <div class="d-flex flex-column h-100 w-100"
           v-bind:style="{'justify-content': listType === 'grid' ? '' : 'center'}">
        <NuxtLink :to="path + '/' + item.slug" class="item-link">
          {{ item.name }}
        </NuxtLink>
        <v-spacer v-if="listType === 'grid'"></v-spacer>
        <div v-bind:class="{'d-flex flex-column': listType === 'grid', 'd-flex' : listType !== 'grid'}">
          <div class="d-flex  align-center mt-2 w-100" v-if="item.categories.length > 0"
               v-bind:class="{'justify-space-between': listType === 'grid', 'justify-start': listType !== 'grid'}"
          >
            <v-select
              v-if="item.categories.length > 1"
              :items="item.categories"
              v-model="addToCartData.option"
              item-text="option"
              item-value="id"
              return-object
              hide-details
              class="mr-3 mt-0 option-select pa-0"
              height="30"
              v-bind:style="{'max-width': listType === 'grid' ? 'calc(100% - 100px)' : '150px'}"
            ></v-select>
            <div v-if="item.categories.length === 1" class="mr-3">{{ addToCartData.option.option }}</div>
            <div class="d-flex align-end"
                 v-bind:style="{'flex-direction': listType === 'grid' ? 'column' : 'row',
                 'min-width': listType === 'grid' ? '100px' : 'unset'}">
              <span class="ml-5" v-bind:class="{'discount': addToCartData.option.discount > 0 || item.discount > 0}">
                <b>{{ addToCartData.option.price }} P</b>
              </span>
              <template v-if="addToCartData.option.discount > 0 || addToCartData.option.discount > 0">
                <span class="green--text ml-4">{{ itemPrice }} P</span>
              </template>
            </div>
          </div>

        </div>
      </div>
      <div class="d-flex justify-center"
           v-bind:class="{'mt-3': listType === 'grid'}"
      >
        <v-btn @click="addToCart" class="w-100"
               :color="listType !== 'grid' ? 'primary' : ''"
               :rounded="listType !== 'grid'"
               :small="listType !== 'grid'"
               :icon="listType !== 'grid'"
               v-bind:class="{'h-100 pl-2 pr-2': listType !== 'grid', 'custom-button': listType === 'grid'}"
        ><span v-if="listType === 'grid'">Добавить в корзину</span>
          <v-icon v-if="listType !== 'grid'">mdi-cart</v-icon>
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import {age, flavor} from "../static/data";
import {environment} from "../assets/environment";

export default {
  props: ['item', 'sort', 'listType'],
  name: "itemForList",
  data() {
    return {
      ages: age,
      flavors: flavor,
      env: environment.api,
      addToCartData: {
        count: 1,
        option: {
          option: '',
          price: 0
        }
      },
      path: '/catalog/' + this.$route.params.category + '/' + this.$route.params.subCategory,
    }
  },
  mounted() {
    this.addToCartData.option = this.item.categories[0];
  },
  methods: {
    addToCart() {
      let cart = localStorage.getItem('cart') != null ? JSON.parse(localStorage.getItem('cart')) : [];
      const option = this.addToCartData.option
      cart.push({
        data: {
          id: this.item.id,
          name: this.item.name,
          picture: this.item.picture,
          producer: this.item.producer,
          discount: this.item.discount,
          flavor: this.item.flavor,
          age: this.item.age
        },
        option: option,
        count: this.addToCartData.count,
        path: `${this.$route.path}/${this.item.slug}?id=${option.id}`
      })
      localStorage.setItem('cart', JSON.stringify(cart));
      this.$store.commit('setCart', cart);
    }
  },
  computed: {
    itemPrice() {
      if (this.item.discount < this.addToCartData.option.discount) {
        if (this.addToCartData.option.discount > 0) {
          return (this.addToCartData.option.price - ((this.addToCartData.option.price / 100) * this.addToCartData.option.discount)).toFixed(2)
        } else {
          return this.addToCartData.option.price
        }
      } else {
        if (this.item.discount > 0) {
          return (this.addToCartData.option.price - ((this.addToCartData.option.price / 100) * this.item.discount)).toFixed(2)
        } else {
          return this.addToCartData.option.price
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "~/assets/default.scss";

.item-for-list{
  width: 100%;
}

.item-price {
  font-family: "Montserrat Bold", sans-serif;
  font-size: 1.2rem;
}

.discount {
  text-decoration: line-through;
}

.item-link {
  text-decoration: none;
  font-size: 1.2rem;
  line-height: 1.5rem;
  color: black;
  transition: .2s;

  &:hover {
    color: dodgerblue;
  }
}

.option-select {
  flex: 0 0 50%;
  font-size: 13px;
}

.img-container {
  height: 70px;
  width: 100px;

  &.empty {
    background-color: lightgray;
  }
  &.grid{
    height: 200px;
    width: 100%;
  }
}

.custom-button {
  background-color: white;
  border-radius: 5px;
  border: 2px solid #e71e63;
  color: #e71e63;
  font-weight: bold;
}

</style>
