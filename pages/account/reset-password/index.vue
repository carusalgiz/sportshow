<template>
  <div class="d-flex flex-column justify-center">
    <div class="page-header">
      <v-container class="d-flex justify-space-between align-center">
        <h1>Личный кабинет</h1>
      </v-container>
    </div>
    <v-container class="page-main">
      <div class="d-md-flex d-lg-flex" v-if="loggedIn">
        <AccountMenu></AccountMenu>
        <div class="main-content">
          <h2 class="mb-3">Смена пароля</h2>
          <v-form @submit.prevent="updateInfo">
            <v-row>
              <v-col cols="12" md="4" xl="4">
                <v-text-field
                  label="Старый пароль"
                  filled
                  class="rounded-sm"
                  rounded
                  :type="passwordsShow.old_password ? 'text' : 'password'"
                  :append-icon="passwordsShow.old_password ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="passwordsShow.old_password = !passwordsShow.old_password"
                  v-model="passwords.old_password"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4" xl="4">
                <v-text-field
                  label="Новый пароль"
                  filled
                  class="rounded-sm"
                  rounded
                  :type="passwordsShow.new_password1 ? 'text' : 'password'"
                  :append-icon="passwordsShow.new_password1 ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="passwordsShow.new_password1 = !passwordsShow.new_password1"
                  v-model="passwords.new_password1"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4" xl="4">
                <v-text-field
                  label="Повторите новый пароль"
                  filled
                  class="rounded-sm"
                  rounded
                  :type="passwordsShow.new_password2 ? 'text' : 'password'"
                  :append-icon="passwordsShow.new_password2 ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="passwordsShow.new_password2 = !passwordsShow.new_password2"
                  v-model="passwords.new_password2"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" xl="6">
                <div class="d-flex justify-center message-block">
                  {{message}}
                </div>
                <div class="d-flex justify-end">
                  <v-btn type="submit">Сохранить</v-btn>
                </div>
              </v-col>
            </v-row>
          </v-form>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>
// import {environment} from "../assets/environment";
import AccountMenu from "../../../components/accountMenu";
import {mapGetters} from "vuex";
import {environment} from "assets/environment";

export default {
  components: {AccountMenu},
  auth: false,
  name: "User",
  data() {
    return {
      loggedIn: false,
      passwords: {
        old_password: '',
        new_password1: '',
        new_password2: ''
      },
      passwordsShow: {
        old_password: false,
        new_password1: false,
        new_password2: false
      },
      message: ''
    }
  },
  methods: {
    ...mapGetters(['getLoginState', 'getUser']),
    checkError(error) {
      if (error.status === 401 || error.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.$store.commit('setLoginState', false);
        this.$store.commit('setIsAdmin', false);
        this.$store.commit('setUser', null);
        this.$router.push('/');
      }
    },
    updateInfo() {
      if (this.passwords.new_password1.trim().length === 0 ||
      this.passwords.new_password2.trim().length === 0 ||
      this.passwords.old_password.trim().length === 0) {
        this.message = 'Для смены пароля все поля должны быть заполнены';
      } else if (this.passwords.new_password2 !== this.passwords.new_password1) {
        this.message = 'Данные в полях для нового пароля не совпадают, проверьте корректность написания'
      } else {
        this.$axios.$post(`${environment.api}/password/change`, this.passwords, {headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }}).then( () => {
          this.message = 'Пароль успешно обновлен';
          this.passwords = {
            old_password: '',
            new_password1: '',
            new_password2: ''
          };
        }, (err) => {
          if (err.old_password) {
            if (err.old_password.filter( elem =>
              elem.includes('Your old password was entered incorrectly. Please enter it again.')).length > 0) {
              this.message = 'Ваш старый пароль введен неверно, проверьте правильность введенного пароля.'
            }
          }
          if (err.new_password1) {
            if (err.new_password1.filter(elem => elem.includes('This password is entirely numeric.')).length > 0) {
              this.message = 'Ваш пароль слишком простой. Пароль должен содержать заглавные и строчные буквы, цифры и спецсимволы'
            }
            if (err.new_password1.filter(elem => elem.includes('This password is too short. It must contain at least 8 characters.')).length > 0) {
              this.message = 'Пароль слишком короткий, длина пароля должна быть больше 8 символов.'
            }
          }
          if (err.new_password2) {
            if (err.new_password2.filter(elem => elem.includes('This password is entirely numeric.')).length > 0) {
              this.message = 'Ваш пароль слишком простой. Пароль должен содержать заглавные и строчные буквы, цифры и спецсимволы'
            }
            if (err.new_password2.filter(elem => elem.includes('This password is too short. It must contain at least 8 characters.')).length > 0) {
              this.message = 'Пароль слишком короткий, длина пароля должна быть больше 8 символов.'
            }
          }
          this.checkError(err.response);
        });
      }
    }
  },
  mounted() {
    this.user = this.getUser();
    this.loggedIn = this.getLoginState();
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'setLoginState') {
        this.loggedIn = state.loginState;
        if (!this.loggedIn) {
          this.$router.push('/')
        }
      }
      if (mutation.type === 'setUser') {
        this.user = state.user;
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

.message-block{
  margin: 15px 0;
}

.menu {
  width: 20%;
  min-width: 250px;
  margin-right: 50px;

  span {
    font-family: 'Montserrat Bold', sans-serif;

    &.active, &:hover {
      color: deeppink;
      cursor: pointer;
    }
  }
}

.main-content {
  width: 80%;
}

@media all and (max-width: 960px) {
  .main-content {
    width: 100%;
  }
}
</style>

