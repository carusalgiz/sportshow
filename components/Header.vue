<template>
    <div class="header md sm" v-bind:class="{'short': scrolled}" id="header">
       <v-container class="d-md-flex d-lg-flex d-sm-none d-none align-center justify-space-between pa-2">
          <div class="contacts-col">
            <v-icon small dark>mdi-phone</v-icon>
            <span>8-924-919-3537</span>
          </div>
          <div class="contacts-col d-lg-flex d-md-none d-sm-none">
            <v-icon small dark>mdi-phone</v-icon>
            <span>8-924-919-3547</span>
          </div>
          <div class="contacts-col">
            <v-icon small dark>mdi-email</v-icon>
            <span>SPORTSANDSHOW@GMAIL.COM</span>
          </div>
          <div class="contacts-col">
            <NuxtLink to="/delivery"><span>ОПЛАТА/ДОСТАВКА</span></NuxtLink>
          </div>
       </v-container>
      <v-divider></v-divider>
      <v-container class="d-md-flex d-lg-flex d-sm-none d-none align-center justify-space-between header-bottom">
        <NuxtLink to="/"><div class="logo"></div></NuxtLink>
        <div class="d-flex menu-rows">
          <NuxtLink to="/catalog"><div class="menu-col" @mouseenter="menuOpen = true" @mouseleave="menuOpen = false">
            <span>КАТАЛОГ</span>
          </div></NuxtLink>
          <NuxtLink to="/about"><div class="menu-col">
            <span>О НАС</span>
          </div></NuxtLink>
          <NuxtLink to="/posts"><div class="menu-col">
            <span>СТАТЬИ И НОВОСТИ</span>
          </div></NuxtLink>
          <NuxtLink to="/contacts"><div class="menu-col">
            <span>КОНТАКТЫ</span>
          </div></NuxtLink>
          <div class="d-flex align-center h-100">
	          <v-btn
		        text
		        icon
		        color="white"
		        @click="menuOpen = true"
		      >
		        <v-icon>mdi-magnify</v-icon>
		      </v-btn>
          </div>
           
        </div>
        <div class="d-sm-flex" style="position: relative">
          <div v-if="!loggedIn">
            <div class="menu-col">
              <v-btn :dark="!scrolled" @click="authOpen = true" text elevation="0">
                <span>Вход</span>
              </v-btn>
            </div>
            <v-scroll-y-transition>
              <Auth v-show="authOpen" v-on:closeAuth="authOpen = false"></Auth>
            </v-scroll-y-transition>
          </div>

          <div class="menu-col user d-flex flex-column align-end">
            <NuxtLink v-if="loggedIn" to="/account/user">
                <span>Личный кабинет</span>
            </NuxtLink>
            <NuxtLink v-if="isStuff && loggedIn " to="/admin">
                <span>Панель администратора</span>
            </NuxtLink>
          </div>
          <NuxtLink to="/cart">
            <div class="menu-col">
              <v-badge
                color="error"
                :content="cart.length"
                :value="cart.length"
              >
                <v-icon :dark="!scrolled" :light="scrolled">mdi-cart</v-icon>
              </v-badge>
            </div>
          </NuxtLink>
        </div>
      </v-container>
      <transition name="fade">
        <div class="catalog-block " v-show="menuOpen"  v-bind:class="{'short': scrolled}">
          <v-container class="d-md-flex d-lg-flex flex-column justify-space-around pa-10" @mouseenter="menuOpen = true" @mouseleave="menuOpen = false">
            <div class="d-flex mt-2 mb-2 align-center">
            	<v-text-field label="Поиск по сайту" 
            		autocomplete="off"
            		@keypress.enter="searchItems"
            		clearable
            		v-model="searchField"></v-text-field>
            	<v-btn class="ml-2" @click="searchItems">Искать</v-btn>
            </div>
            <div class="d-flex">
	            <v-col cols="4" class="d-flex flex-column">
	              <NuxtLink to="/catalog/sredstva-gigieny-i-kosmetika"><h3>Средства гигиены и косметика</h3></NuxtLink>
	              <NuxtLink to="/catalog/sredstva-gigieny-i-kosmetika/shampuni"><span>Шампуни</span></NuxtLink>
	              <NuxtLink to="/catalog/sredstva-gigieny-i-kosmetika/balzamy-i-maski"><span>Бальзамы и маски</span></NuxtLink>
	              <NuxtLink to="/catalog/sredstva-gigieny-i-kosmetika/sprei-i-sredstva-dlya-gruminga"><span>Спреи и средства для груминга</span></NuxtLink>
	              <NuxtLink to="/catalog/sredstva-gigieny-i-kosmetika/gigiena"><span>Гигиена</span></NuxtLink>
	              <br/>
	              <NuxtLink to="/catalog/soderzhanie"><h3>Содержание</h3></NuxtLink>
	              <NuxtLink to="/catalog/soderzhanie/kletky-i-boksi"><span>Клетки и боксы</span></NuxtLink>
	              <NuxtLink to="/catalog/soderzhanie/rascheski"><span>Расчески</span></NuxtLink>
	              <NuxtLink to="/catalog/soderzhanie/drugoe"><span>Другое</span></NuxtLink>
	            </v-col>
	            <v-divider vertical></v-divider>
	            <v-col cols="4" class="d-flex flex-column pl-10">
	              <NuxtLink to="/catalog/korma"><h3>Корма</h3></NuxtLink>
	              <NuxtLink to="/catalog/korma/dlya-koshek-sukhoi"><span>Сухой для кошек</span></NuxtLink>
	              <NuxtLink to="/catalog/korma/dlya-sobak-sukhoi"><span>Сухой для собак</span></NuxtLink>
	              <NuxtLink to="/catalog/korma/dlya-koshek-vlazhnyi"><span>Влажный для кошек</span></NuxtLink>
	              <NuxtLink to="/catalog/korma/dlya-sobak-vlazhnyi"><span>Влажный для собак</span></NuxtLink>
	            </v-col>
	            <v-divider vertical></v-divider>
	            <v-col cols="4" class="d-flex flex-column pl-10">
	              <NuxtLink to="/catalog/vitaminy"><h3>Витамины</h3></NuxtLink>
	              <NuxtLink to="/catalog/vitaminy/systavy-i-kosti"><span>Суставы и кости</span></NuxtLink>
	              <NuxtLink to="/catalog/vitaminy/sherst"><span>Шерсть</span></NuxtLink>
	              <NuxtLink to="/catalog/vitaminy/pishchevarenie"><span>Пищеварение</span></NuxtLink>
	              <NuxtLink to="/catalog/vitaminy/kompleks"><span>Комплекс</span></NuxtLink>
	            </v-col>
            </div>
          </v-container>
        </div>
      </transition>
      <v-container class="d-sm-flex  d-flex d-md-none d-lg-none align-center">
        <v-app-bar-nav-icon :dark="!scrolled" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-spacer></v-spacer>
        <NuxtLink to="/"><div class="logo"></div></NuxtLink>
        <v-spacer></v-spacer>
      </v-container>
      <v-navigation-drawer
        v-model="drawer"
        color="#f7f7f7"
        class="pa-4 custom-drawer"
        fixed
        temporary
      >
        <div class="d-flex justify-center mb-3">
          <NuxtLink to="/"><div class="logo menu"></div></NuxtLink>
        </div>
        <div class="d-sm-flex" style="position: relative">
          <div v-if="!loggedIn" class="mb-4">
            <v-list-item class="custom-list-mobile" @click="authOpen = !authOpen" v-if="!authOpen">
              <div class="menu-item-mobile">Вход</div>
            </v-list-item>
            <Auth v-show="authOpen" v-on:closeAuth="authOpen = false" mobile="true"></Auth>
          </div>

          <v-list-item class="custom-list-mobile mb-4" v-if="loggedIn">
            <NuxtLink  to="/account/user">
              <div class="menu-item-mobile d-flex">
                <v-icon class="mr-3">mdi-account</v-icon>
                Личный кабинет
              </div>
            </NuxtLink>
          </v-list-item>
          <v-list-item class="custom-list-mobile mb-4" v-if="isStuff && loggedIn">
            <NuxtLink to="/admin">
              <div class="menu-item-mobile">Панель администратора</div>
            </NuxtLink>
          </v-list-item>
          <v-list-item class="custom-list-mobile mb-4">
            <NuxtLink to="/cart">
              <div class="d-flex">
                <v-badge
                  color="error"
                  :content="cart.length"
                  :value="cart.length"
                >
                  <v-icon>mdi-cart</v-icon>
                </v-badge>
                <div class="menu-item-mobile ml-6">Корзина</div>
              </div>

            </NuxtLink>
          </v-list-item>
        </div>
        <v-list-item class="custom-list-mobile mb-4"><NuxtLink to="/posts"><div class="menu-item-mobile">
          <span>Статьи и Новости</span>
        </div></NuxtLink></v-list-item>

        <v-expansion-panels v-model="panelMobile" multiple accordion>
          <template v-for="(cat,i) of categories">
            <v-expansion-panel v-if="cat.name !== 'Все'" :key="i" class="custom-menu-panel">
              <v-expansion-panel-header class="menu-item-mobile pl-3 pr-2">
                {{cat.name}}
                <template v-slot:actions>
                  <v-icon color="pink">
                    $expand
                  </v-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content class="panel-content">
                <v-list-item v-for="(sub, j) of cat.subs" :key="j + 'item'" class="custom-list-panel pa-0">
                  <NuxtLink :to="'/catalog/' + cat.link + '/' + sub.link">
                    <div class="d-flex align-center">
                      <v-icon class="mr-2">mdi-chevron-right</v-icon>
                      <div class="menu-item-mobile">{{sub.name}}</div>
                    </div>
                  </NuxtLink>
                </v-list-item>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </template>
        </v-expansion-panels>
        <v-list-item class="custom-list-mobile mb-4 mt-5"><NuxtLink to="/about"><div class="menu-item-mobile">
          <span>О нас</span>
        </div></NuxtLink></v-list-item>
        <v-list-item class="custom-list-mobile mb-4"><NuxtLink to="/contacts"><div class="menu-item-mobile">
          <span>Контакты</span>
        </div></NuxtLink></v-list-item>
        <v-list-item class="custom-list-mobile mb-4"><NuxtLink to="/delivery"><div class="menu-item-mobile">
          <span>Оплата и доставка</span>
        </div></NuxtLink></v-list-item>
        <v-btn class="w-100 mobile-exit-btn mb-3" v-if="loggedIn" @click="logout">Выйти</v-btn>
        <div class="custom-list-mobile footer mb-4 d-flex flex-column pa-4">
          <div class="w-100 mb-3">
            <v-icon small>mdi-phone</v-icon>
            <span>+7 (4212) 933-626</span>
          </div>
          <div class="w-100 mb-3">
            <v-icon small>mdi-phone</v-icon>
            <span>+7-914-183-99-88</span>
          </div>
          <div class="w-100">
            <span>Хабаровск, ул.Дикопольцева 1</span>
          </div>
          <div class="w-100 mb-3">
            <span>08:00 − 20:00</span>
          </div>
          <div class="w-100">
            <v-icon small>mdi-email</v-icon>
            <span>sportsandshow@gmail.com</span>
          </div>
        </div>
      </v-navigation-drawer>
    </div>
</template>

<script>
    import Auth from "./Auth";
    import {categories} from "../static/data";
    import {environment} from "../assets/environment";
    import {mapGetters} from "vuex";
    export default {
      auth: false,
      components: {Auth},
      head: {
        htmlAttrs: {
          lang: 'ru'
        },
        meta: [
          { name : "viewport", content: "width=device-width, initial-scale=1, maximum-scale=5, user-scalable=no, minimal-ui"}
        ]
      },
      props: ['scrolled'],
      data() {
        return {
          panelMobile: [],
          authOpen: false,
          isStuff: false,
          menuOpen: false,
          loggedIn: false,
          cart: [],
          drawer: false,
          categories: categories,
          searchField: ''	
        }
      },
      methods: {
        ...mapGetters(['getLoginState', 'getCart', 'getIsAdmin']),
        clickOutside(){
          if (document.documentElement.clientWidth > 960) {
            this.authOpen = false;
          }
        },
        searchItems() {
          if (this.searchField.trim().length > 0) {
        	this.$router.push(`/catalog?search=${this.searchField.trim()}`);
          }
        },
        logout() {
          this.$axios.post(`${environment.api}/logout`).then(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            this.$store.commit('setLoginState', false);
            this.$store.commit('setIsAdmin', false);
            this.$store.commit('setUser', null);
            this.loggedIn = false;
            this.isStuff = false;
          }, () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            this.$store.commit('setLoginState', false);
            this.$store.commit('setIsAdmin', false);
            this.$store.commit('setUser', null);
            this.loggedIn = false;
            this.isStuff = false;
          });
        },
      },
      mounted() {
        if (location.hash === '#auth' || location.href.includes('checkMail=true')) {
            this.authOpen = true;
        }
        this.loggedIn = this.getLoginState();
        this.cart = this.getCart() != null ? this.getCart() : [];
        this.isStuff = this.getIsAdmin();
        this.$store.subscribe((mutation, state) => {
          if (mutation.type === 'setLoginState') {
            this.loggedIn = state.loginState
          }
          if (mutation.type === 'setCart') {
            this.cart = state.cart ? state.cart : []
          }
          if (mutation.type === 'setIsAdmin') {
            this.isStuff = state.isAdmin;
          }
        });
        if (localStorage.getItem('cart') != null) {
          this.$store.commit('setCart', JSON.parse(localStorage.getItem('cart')));
        }
      },
      name: "Header"
    }
</script>

<style scoped lang="scss">
  @import "~/assets/default.scss";
  @import "~/assets/fonts.scss";
  *{
    font-family: "Montserrat", sans-serif;
  }
  a{
    text-decoration: none;
  }
  .fade-enter-active, .fade-leave-active {
    transition: .2s;
    transform: translateX(0);
  }
  .fade-enter, .fade-leave-to{
    opacity: 0;
    transform: translateX(-10px);
  }

  .header{
    position: fixed;
    transition: .2s;
    top: 0;
    background-color: rgba(0,0,0,0.6);
    color: white;
    width: 100%;
    z-index: 20;
    a {
      color: white;
    }
  }
  .menu-col > span{
    border-bottom: 2px solid transparent;
    padding-bottom: 5px;
    transition: .2s border-bottom-color;
  }
  .contacts-col{
    width: fit-content;
    font-size: 13px;
    opacity: 0.7;
    transition: .2s opacity;
  }
  .contacts-col:hover{
    opacity: 1;
  }
  .header-bottom{
    height: 94px;
    padding: 0;
    .menu-rows{
      height: 100%;
    }
  }
  .logo{
    background: url("../assets/logo.png");
    background-size: contain;
    filter: brightness(0) invert(1);
  }
  .menu-col{
    width: fit-content;
    padding: 20px;
    height: 100%;
    display: flex;
    align-items: center;
  }
  .menu-col:hover, .contacts-col:hover{
    cursor: pointer;
  }
  .menu-col:not(.user):hover > span{
    border-bottom: 2px solid white;
  }
  .menu-col.user span:hover{
    font-weight: bold;
  }
  .catalog-block.short{
    top: 94px;
  }
  .custom-menu-panel{
    border: 0;
  }
  .catalog-block{
    position: fixed;
    top: 130px;
    transition: .2s;
    width: 100%;
    font-family: 'Open Sans', sans-serif;
    letter-spacing: 0.05em;
    display: flex;

    .container{
      background-color: white;
      color: black;
      height: 450px;
      padding: 10px;
      box-shadow: 0 6px 30px 0 rgba(0,0,0,.3);
      border-radius: 0 0 10px 10px;
    }

      a {
        color: black;
        text-decoration: none;
        h3{
          margin-bottom: 10px;
          border-bottom: 1px solid transparent;
          width: fit-content;
        }
        span{
          line-height: 30px;
          padding-left: 20px;
          transition: .2s color;
        }
        &:hover{
          color: dodgerblue;
          cursor: pointer;
        }
        &:active{
          font-weight: bold;
          color: #57adff;
          cursor: pointer;
        }
    }
  }
  .custom-drawer{
    background-color: #f7f7f7;
    width: 85%;
    min-width: 330px;
    max-width: 450px;
  }
  @media all and (min-width: 961px){
    .header.md{
      height: 130px;
      &.short{
        background-color: white;
        top: -36px;
        border-bottom: 1px solid rgb(0 0 0 / 10%);
        .logo{
          filter: invert(0);
        }
        a {
          color: black;
        }
      }
    }
    .logo{
      height: 55px;
      width: 250px;
    }
  }
  @media all and (max-width: 960px){
    .catalog-block{
      display: none;
    }
    .header.sm{
      height: 70px;
      &.short{
        background-color: white;
        border-bottom: 1px solid rgb(0 0 0 / 10%);
        .logo{
          filter: invert(0);
        }
        a {
          color: black;
        }
      }
    }
    .menu-item-mobile{
      color: black;
    }
    .logo{
      height: 45px;
      width: 200px;
      &.menu{
        filter: brightness(0) opacity(0.4);
      }
    }
    .v-expansion-panel::before{
      box-shadow: unset !important;
    }
    .custom-list-mobile{
      background-color: white;
      border-radius: 5px;
      color: black;
      &.footer{
        font-size: .9rem;
      }
    }
    .custom-list-panel{
      margin-left: -10px;
      width: calc(100% + 20px);
      font-size: 0.95rem;
    }
    .mobile-exit-btn{
      border: 2px solid rgb(233 30 99);
      border-radius: 7px;
      color: rgb(233 30 99);
      font-family: "Montserrat Bold", sans-serif;
      background-color: rgb(255 255 255) !important;
    }
  }
</style>
