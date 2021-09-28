<template>
  <v-app light>
    <transition name="fade">
      <div>
        <div class="page-header d-flex justify-space-between">
          <div class="d-flex">
            <NuxtLink to="/"><div class="logo"></div></NuxtLink>
            <h1 class="ml-10">Панель администратора</h1>
          </div>

            <v-btn class="mr-4" @click="logout">Выйти из учетной записи</v-btn>
        </div>
        <div class="admin-main" v-if="isAuthStaff">
          <sidemenu></sidemenu>
          <div class="w-100">
            <div class="main-container">
              <Nuxt />
            </div>
          </div>
        </div>
      </div>

    </transition>
    <transition name="fade">
      <div v-if="!isAuthStaff">
        <div v-if="!isLoad" class="loader">
          <v-progress-circular
            :size="70"
            :width="7"
            color="purple"
            indeterminate
          ></v-progress-circular>
        </div>
        <div v-if="isLoad">
          <span>У вас нет прав для доступа к данной странице</span>
          <NuxtLink to="/admin">Вернуться на страницу авторизации</NuxtLink>
        </div>
      </div>
    </transition>
  </v-app>
</template>

<script>
    import {environment} from "../assets/environment";
    import Sidemenu from "../components/admin/sidemenu";
    import {Titles} from '../models/adminPageTitles'

    export default {
      components: {Sidemenu},
      data() {
        return {
          isAuthStaff: false,
          isLoad: false,
          pageName: ''
        }
      },
      mounted() {
        this.pageName = Titles[this.$route.path.split('/')[this.$route.path.split('/').length - 1]];
        this.$store.subscribe((mutation, state) => {
          if (mutation.type === 'setIsAdmin') {
            this.isAuthStaff = state.isAdmin;
            this.isLoad = true;
            if (!this.isAuthStaff) {
              this.$router.push('/admin');
            }
          }
        });
        if (localStorage.getItem('token') != null) {
          this.$axios.post(`${environment.api}/token/refresh/`, {refresh: localStorage.getItem('refresh_token')}).then(res => {
            localStorage.setItem('token', res.data.access);
            this.$store.commit('setToken',res.data.access);
            this.$store.commit('setLoginState', true);
            this.$store.commit('setUser', JSON.parse(localStorage.getItem('user')));
            this.$store.commit('setIsAdmin', JSON.parse(localStorage.getItem('user')).is_staff);
          }, () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            this.$store.commit('setLoginState', false);
            this.$store.commit('setUser', null);
            this.$store.commit('setIsAdmin', false);
          });
        } else {
          this.$store.commit('setIsAdmin', false);
          this.isLoad = true;
        }
      },
      methods: {
        logout() {
          this.$axios.post(`${environment.api}/logout`).then(res => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            this.$store.commit('setLoginState', false);
            this.$store.commit('setIsAdmin', false);
            this.$store.commit('setUser', null);
            this.$router.push('/admin');
          }, () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            this.$store.commit('setLoginState', false);
            this.$store.commit('setIsAdmin', false);
            this.$store.commit('setUser', null);
            this.$router.push('/admin');
          });
        }
      },
      watch: {
        $route () {
          this.pageName = Titles[this.$route.path.split('/')[this.$route.path.split('/').length - 1]];
        }
      }
    }
</script>

<style scoped lang="scss">
  @import "~/assets/fonts.scss";
  .admin-main{
    display: flex;
    font-family: "Montserrat", sans-serif;
    height: calc(100vh - 70px);
  }
  .main-container{
    padding: 20px;
  }

  .fade-enter-active, .fade-leave-active {
    transition: .2s;
    opacity: 1;
  }
  .fade-enter, .fade-leave-to{
    opacity: 0;
    transition: .2s;
  }
  .loader{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
  }
  .w-100{
    width: 100%;
  }
  .page-header{
    background: rgb(90 119 156);
    color: white;
    height: 70px;
    padding-left: 30px;
    display: flex;
    align-items: center;
  }

  .logo{
    background: url("../assets/logo.png") 100% 100%;
    height: 55px;
    width: 250px;
    filter: brightness(0) invert(1);
  }
</style>
