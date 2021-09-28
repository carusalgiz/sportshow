<template>
  <div class="signup-wrapper d-flex flex-column align-center justify-center">
    <transition name="fade">
      <div v-if="!isAuthStaff && isLoad">
        <v-form v-model="loginValid" class="signup-form" @submit.prevent="userLogin">
          <h1 class="title text-center">Вход в панель администратора</h1>
          <v-text-field
            label="Логин" required filled rounded
            :rules="usernameRules"
            :prefix="auth.username.length > 0 ? '+': ''" v-mask="'7 (###) ### ##-##'"
            v-model="auth.username"
          ></v-text-field>
          <v-text-field
            label="Пароль"
            :rules="passwordRules"
            required filled rounded
            :type="showPassLogin ? 'text' : 'password'"
            v-model="auth.password"
            :append-icon="showPassLogin ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassLogin = !showPassLogin"
          ></v-text-field>
          <div class="text-success mb-5">{{loginMessage}}</div>
          <div class="d-flex flex-column align-center">
            <v-btn :color="!loginValid ? 'primary' : 'pink'" :dark="loginValid" large tile class="mb-3" :disabled="!loginValid" type="submit">Войти</v-btn>
          </div>
        </v-form>
      </div>
    </transition>
    <div v-if="!isLoad" class="loader">
      <v-progress-circular
        :size="70"
        :width="7"
        color="purple"
        indeterminate
      ></v-progress-circular>
    </div>
    <transition name="fade">
      <div v-if="isLoad && isAuthStaff">
        <v-btn @click="continueLink" color="primary">Продолжить</v-btn>
      </div>
    </transition>
  </div>

</template>

<script>
  import Auth from "../../components/Auth";
  import {environment} from "../../assets/environment";

  export default {
    components: {Auth},
    layout: "empty",
    name: "index",
    data: () => ({
      isLoad: false,
      isAuthStaff: false,
      showPassLogin: false,
      loginValid: false,
      loginMessage: '',
      auth: {
        username: '',
        password: ''
      },
      usernameRules: [
        v => !!v || 'Не указан телефон'
      ],
      passwordRules: [
        v => !!v || 'Заполните ваш пароль'
      ],
    }),
    mounted() {
      console.log(this.$store.state);
      this.isAuthStaff = this.$store.state.isAdmin;
      this.isLoad = true;
      this.continueLink();
    },
    methods:{
      continueLink() {
        if (this.$store.state.isAdmin) {
          this.$router.push('/admin/users')
        } else {
          this.isAuthStaff = false
        }
      },
      userLogin() {
        this.isLoad = false;
        const data = {
          username: this.auth.username
            .split('(').join('')
            .split(')').join('')
            .split(' ').join('')
            .split('-').join(''),
          password: this.auth.password
        };
        this.$axios.post(`${environment.api}/login/`, data).then(res => {
          this.$store.commit('setLoginState',true);
          this.$store.commit('setToken',res.data.access_token);
          this.$store.commit('setUser', res.data.user);
          this.$store.commit('setIsAdmin', res.data.user.is_staff);
          localStorage.setItem('user', JSON.stringify(res.data.user));
          localStorage.setItem('token', res.data.access_token);
          localStorage.setItem('refresh_token', res.data.refresh_token);
          this.continueLink();
          this.isLoad = true;
        }, (err) => {
          this.loginMessage = '';
          for (const errorKey in err.response.data) {
            if (err.response.data.hasOwnProperty(errorKey)) {
              for (const errorValue of err.response.data[errorKey]) {
                this.loginMessage += errorValue + '; \n';
              }
            }
          }
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('refresh_token');
          this.$store.commit('setLoginState',false);
          this.$store.commit('setToken', null);
          this.$store.commit('setUser', null);
          this.$store.commit('setIsAdmin', false);
          this.isLoad = true;
        });
      }
    }
  }
</script>

<style scoped>
  @import "~/assets/fonts.scss";
  .signup-wrapper{
    width: 100vw;
    height: 100vh;
    background: linear-gradient(to bottom, rgb(201 220 255), rgb(255 239 254));
  }
  .loader{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
  }
  .signup-form{
    width: 400px;
    background-color: white;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 0 10px 2px lightgray;
  }
  .title{
    font-family: 'Montserrat Bold', sans-serif !important;
    font-size: 1.5rem !important;
    line-height: 1.5rem;
    color: darkslategrey;
    margin-bottom: 40px;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .2s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
    opacity: 0;
  }

</style>
