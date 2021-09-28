<template>
  <div class="menu">
    <v-list outlined class="rounded-lg">
      <v-list-item>
        <NuxtLink to="/account/user" v-bind:class="content === 'user' ? 'active' : ''">Личные данные</NuxtLink>
      </v-list-item>
      <v-list-item>
        <NuxtLink to="/account/orders" v-bind:class="content === 'orders' ? 'active' : ''"
        >Мои заказы
        </NuxtLink>
      </v-list-item>
      <v-list-item>
        <NuxtLink to="/account/reset-password" v-bind:class="content === 'reset-password' ? 'active' : ''"
        >Смена пароля
        </NuxtLink>
      </v-list-item>
    </v-list>
    <v-btn class="mt-10 w-100" large text outlined @click="logout">Выйти</v-btn>
  </div>
</template>

<script>
  import {environment} from "../assets/environment";

  export default {
    name: "AccountMenu",
    methods: {
      logout() {
        this.$axios.post(`${environment.api}/logout`).then(res => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          this.$store.commit('setLoginState', false);
          this.$router.push('/');
        }, () => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          this.$store.commit('setLoginState', false);
          this.$router.push('/');
        });
      },
    },
    computed: {
      content() {
        const pathArray = this.$route.path.split('/');
        return pathArray[pathArray.length - 1];
      }
    }
  }
</script>

<style scoped lang="scss">
  .w-100{
    width: 100%;
  }
  .menu {
    width: 20%;
    min-width: 250px;
    margin-right: 50px;

    a {
      font-family: 'Montserrat Bold', sans-serif;
      text-decoration: none;
      color: black;
      &.active, &:hover {
        color: deeppink;
        cursor: pointer;
      }
    }
  }
  @media all and (max-width: 960px) {
    .menu{
      width: 100% !important;
      margin-bottom: 50px;
    }
  }
</style>
