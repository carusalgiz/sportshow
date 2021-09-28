<template>
  <v-app light v-scroll="onScroll">
    <div class="main">
      <div class="d-flex flex-column justify-center">
        <div class="page-header"></div>
        <v-container class="page-main">
          <div class="w-100 d-flex flex-column align-center mt-5">
            <h1 class="text-center">К сожалению, страница отсутствует на данный момент</h1>
            <NuxtLink to="/" class="mt-10">Вернуться на главную</NuxtLink>
          </div>
        </v-container>
      </div>
    </div>
    <Footer></Footer>
  </v-app>
</template>

<script>
    import Footer from "../components/Footer";
    import Header from "../components/Header";

    export default {
      name: "error",
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
  @import "~/assets/default.scss";
  @import "~/assets/fonts.scss";
</style>
