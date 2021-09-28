<template>
  <div class="d-flex flex-column justify-center">
    <div class="page-header">
      <v-container class="d-flex justify-space-between align-center">
        <h1>Личный кабинет</h1>
      </v-container>
    </div>
    <v-container class="page-main">
      <transition name="fade">
        <AccountMenu v-if="isLogged"></AccountMenu>
      </transition>
      <transition name="fade">
        <div class="d-flex w-100 justify-center" v-if="!isLogged">
          <h2>Для просмотра данных личного кабинета необходимо войти в учетную запись</h2>
        </div>
      </transition>
    </v-container>
  </div>
</template>

<script>
  import AccountMenu from "../../components/accountMenu";
  import {mapGetters} from "vuex";

  export default {
    components: {AccountMenu},
    auth: false,
    name: "Account",
    data() {
      return {
        isLogged: false
      }
    },
    methods: {
      ...mapGetters(['getLoginState']),
    },
    mounted() {
      this.$store.subscribe((mutation, state) => {
        if (mutation.type === 'setLoginState') {
          this.loggedIn = state.loginState;
        }
      });
    }
  }
</script>

<style scoped lang="scss">
  @import "~/assets/default.scss";

  .page-header {
    h1 {
      font-family: 'Montserrat Light', sans-serif;
    }
  }

  .main-content {
    width: 80%;
  }

  .fade-enter-active, .fade-leave-active {
    transition: .2s;
    opacity: 1;
  }

  .fade-enter, .fade-leave-to {
    transition: .2s;
    opacity: 0;
  }
</style>
