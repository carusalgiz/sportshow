<template>
  <div>
    <v-carousel
      cycle
      :height="height"
      hide-delimiter-background
      hide-delimiters
    >
      <v-carousel-item v-for="(advert,index) of adverts" :key="index">
        <v-parallax
          class="parallax"
          :height="height > 960 ? 850 : height"
          :src="apiUrl + advert.picture">
          <div class="ml-md-15 ml-lg-15">
            <div class="parallax-text" v-html="advert.text"></div>
            <v-btn
              class="mt-md-10 mt-lg-10"
              elevation="3"
              tile
              x-large
              dark
              color="pink"
              v-if="advert.link"
            ><NuxtLink class="light-link" :to="advert.link">Перейти</NuxtLink></v-btn>
          </div>
        </v-parallax>
      </v-carousel-item>
    </v-carousel>
    <div class="img-wave"></div>
    <v-container>
      <div class="d-flex flex-column justify-center align-center main-description">
        <h1 class="mb-5 mt-5">Sports and Show</h1>
        <h4 class="mb-5 text-center">Косметические средства по уходу за животными</h4>
        <div class="d-flex align-center ml-2 mr-2">
          <div style="height: 5px; width: 20px; background-color: lightblue"></div>
          <span class="text-center">Мы хотим, чтобы Ваши питомцы чувствовали Вашу заботу и уход!</span>
          <div style="height: 5px; width: 20px; background-color: lightblue"></div>
        </div>
        <div class="d-md-flex d-lg-flex d-none d-sm-none cards-block">
          <div
            class="pa-7 d-flex flex-column align-end achieve-card rounded-xl"
          >
            <div class="d-flex align-center">
              <h2 class="mr-5 text-right">ОТЛИЧНАЯ<br/>ПРОДУКЦИЯ</h2>
              <div class="blob d-flex align-center justify-center">
                <div class="blob-inner d-flex align-center justify-center">
                  <v-icon large dark>mdi-medal</v-icon>
                </div>
              </div>
            </div>
            <span class="mt-6 text--secondary">Только проверенные бренды <br> и поставщики!</span>
            <div class="d-flex justify-center button-block">
              <v-btn color="primary" rounded>Каталог</v-btn>
            </div>
          </div>
          <div
            class="pa-7 d-flex flex-column achieve-card ml-7 mr-7 center rounded-xl"
          >
            <div class="card-center d-flex flex-column align-center justify-center">
              <div class="blob d-flex align-center justify-center">
                <div class="blob-inner d-flex align-center justify-center">
                  <v-icon large dark>mdi-medal</v-icon>
                </div>
              </div>
              <h2 class="mr-5 mt-5 text-center">ДОСТАВИМ<br/> ПО ХАБАРОВСКУ</h2>
            </div>
            <span class="mt-6 text--secondary">Бесплатная доставка по Хабаровску <br> от 2000 р.</span>
            <div class="d-flex justify-center button-block">
              <v-btn color="primary" rounded>Оплата и доставка</v-btn>
            </div>
          </div>
          <div
            class="pa-7 d-flex flex-column align-start achieve-card rounded-xl"
          >
            <div class="d-flex align-center">
              <div class="blob d-flex align-center justify-center">
                <div class="blob-inner d-flex align-center justify-center">
                  <v-icon large dark>mdi-medal</v-icon>
                </div>
              </div>
              <h2 class="ml-5 text-left">НАША<br/> ИСТОРИЯ</h2>
            </div>
            <span class="mt-6 text--secondary">Работаем с 2016 года</span>
            <div class="d-flex justify-center button-block">
              <v-btn color="primary" rounded>О нас</v-btn>
            </div>
          </div>
        </div>
        <div class="d-flex d-sm-flex flex-column d-md-none d-lg-none mt-15">
          <div
            class="pa-7 d-flex flex-column achieve-card mt-13 mb-13 ml-4 mr-4 center rounded-xl"
          >
            <div class="card-center d-flex flex-column align-center justify-center">
              <div class="blob d-flex align-center justify-center">
                <div class="blob-inner d-flex align-center justify-center">
                  <v-icon large dark>mdi-medal</v-icon>
                </div>
              </div>
              <h2 class="text-center mt-4">ОТЛИЧНАЯ<br/>ПРОДУКЦИЯ</h2>
            </div>
            <span class="mt-6 text--secondary">Только проверенные бренды и поставщики!</span>
            <div class="d-flex justify-center button-block">
              <v-btn color="primary" rounded>Каталог</v-btn>
            </div>
          </div>
          <div
            class="pa-7 d-flex flex-column achieve-card mt-13 mb-13 ml-4 mr-4  center rounded-xl"
          >
            <div class="card-center d-flex flex-column align-center justify-center">
              <div class="blob d-flex align-center justify-center">
                <div class="blob-inner d-flex align-center justify-center">
                  <v-icon large dark>mdi-medal</v-icon>
                </div>
              </div>
              <h2 class="text-center mt-4">ДОСТАВИМ<br/> ПО ХАБАРОВСКУ</h2>
            </div>
            <span class="mt-6 text--secondary">Бесплатная доставка по Хабаровску от 1500 р.</span>
            <div class="d-flex justify-center button-block">
              <v-btn color="primary" rounded>Оплата и доставка</v-btn>
            </div>
          </div>
          <div
            class="pa-7 d-flex flex-column achieve-card mt-13 mb-13 ml-4 mr-4  center rounded-xl"
          >
            <div class="card-center d-flex flex-column align-center justify-center">
              <div class="blob d-flex align-center justify-center">
                <div class="blob-inner d-flex align-center justify-center">
                  <v-icon large dark>mdi-medal</v-icon>
                </div>
              </div>
              <h2 class="text-center mt-4">НАША<br/> ИСТОРИЯ</h2>
            </div>
            <span class="mt-6 text--secondary">Работаем с 2016 года</span>
            <div class="d-flex justify-center button-block">
              <v-btn color="primary" rounded>О нас</v-btn>
            </div>
          </div>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>
import {environment} from "assets/environment";

export default {
  auth: false,
  head() {
    return {
      title: 'S&S Аксессуары для питомцев',
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@100&display=swap'
        }
      ]
    }
  },
  data() {
    return {
      height: 0,
      adverts: [],
      apiUrl: environment.api
    }
  },
  methods: {
    getArticles() {
      this.$axios.get(`${environment.api}/advertising`).then( (result) => {
        this.adverts = result.data;
      }, (err) => {

      });
    }
  },
  mounted() {
    this.height = document.documentElement.clientHeight;
    this.getArticles();
  },
  components: {
  }
}
</script>
<style scoped lang="scss">
  @import "~/assets/default.scss";
  @import "~/assets/fonts.scss";
  *{
    font-family: 'OpenSans', sans-serif;
  }
  .parallax{
    margin-bottom: -96px;
  }
  .parallax-text{
    color: #ffffff;
    text-shadow: 0 0 11px black;
    font-weight: 300;
    letter-spacing: 0.2em;
    margin-bottom: 30px;
  }
  .img-wave{
    background: url('../assets/slide_element.png');
    width: 100%;
    height: 96px;
    position: relative;
    margin-top: -96px;
  }
  .main-description{
    padding: 60px 0 220px 0;
  }
  .main-description h2{
    font-family: 'Montserrat Light', sans-serif;
    letter-spacing: 0.05em;
  }
  .main-description > h1{
    font-family: "Montserrat", sans-serif;
    font-size: 4rem;
    font-weight: 200;
    letter-spacing: 0.05em;
  }
  .main-description > h4{
    font-size: 1.3rem;
    font-weight: 300;
    letter-spacing: 0.02em;
  }
  .main-description span{
    font-weight: 400;
  }
  .blob{
    background: rgb(39,117,255);
    border-radius: 50%;
    margin: 10px;
    height: 70px;
    width: 70px;

    box-shadow: 0 0 0 0 rgba(39,117,255,1);
    animation:  pulse 2s infinite;
  }
  .blob-inner{
    background: rgb(39,117,255);
    border-radius: 50%;
    height: 70px;
    width: 70px;

    box-shadow: 0 0 0 0 rgba(39,117,255,1);
    animation:  pulse-inner 2s infinite;
  }
  .cards-block{
    margin-top: 80px;
  }
  .achieve-card{
    transition: .2s box-shadow;
    background-color: white;
    .button-block{
      position: relative;
      width: 100%;
      align-items: center;
      top: 20px;
      margin-bottom: -20px;
      opacity: 0;
      transform: translateY(5px);
      transition: .2s opacity, .2s transform;
    }
  }
  .achieve-card:hover > .button-block{
    transform: translateY(0);
    opacity: 1;
  }
  .achieve-card.center{
    box-shadow: 0 6px 30px 0 rgba(0,0,0,.12) !important;
    .button-block{
      opacity: 1;
    }
  }
  .card-center{
    position: relative;
    top: -80px;
    margin-bottom: -80px;
  }
  .achieve-card:hover{
    cursor: default;
  }
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(39,117,255,0.05);
    }
    30% {
      box-shadow: 0 0 0 15px rgba(39,117,255,0.2);
    }
    70% {
      box-shadow: 0 0 0 15px rgba(39,117,255,0.1);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(39,117,255,0.05);
    }
  }
  @keyframes pulse-inner {
    0% {
      box-shadow: 0 0 0 0 rgba(39,117,255,0.05);
    }
    80% {
      box-shadow: 0 0 0 8px rgba(39,117,255,0.15);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(39,117,255,0.05);
    }
  }
  @media all and (max-width: 960px){
    .parallax{
      height: calc(100vh - 50px) !important;
    }
    .parallax-title{
      margin-bottom: 50%;
      font-size: 2rem;
      line-height: 2.5rem;
    }
    .main-description{
      padding: 60px 0;
    }
    .main-description > h1{
      font-size: 2.2rem;
    }
  }
</style>
