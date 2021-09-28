<template>
  <v-app light v-scroll="onScroll">
    <Header :scrolled="scrolled"></Header>
    <div class="main">
      <Nuxt />
    </div>
    <Footer></Footer>
  </v-app>
</template>

<script>
import Header from "../components/Header";
import Footer from "../components/Footer";
export default {
  head: {
    htmlAttrs: {
      lang: 'ru'
    },
    meta: [
      { description: 'В нашем зоомагазине вы можете заказать товары для вашего домашнего питомца. Наши консультанты проконсультируют вас по любым вопросам. \n' +
          'В онлайн каталоге представлены корма, аксессуары, амуниция, игрушки и многое другого для кошек и собак.'},
      {name: 'yandex-verification', content: '6a533bb69f3f3ea9'}
    ]
  },
  components: {Footer, Header},
  data () {
    return {
      scrolled: false
    }
  },
  methods: {
    onScroll(event) {
      this.scrolled = event.target.documentElement.scrollTop > 150;
    }
  }
}
</script>
<style scoped>
  .main{
  }
</style>
