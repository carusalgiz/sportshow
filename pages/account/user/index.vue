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
          <h2 class="mb-3">Редактирование</h2>
          <v-form @submit.prevent="updateInfo">
            <v-row>
              <v-col cols="12" md="6" xl="6">
                <v-text-field
                  label="Имя"
                  filled
                  class="rounded-sm"
                  rounded
                  v-model="user.first_name"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" xl="6">
                <v-text-field
                  label="Фамилия"
                  filled
                  class="rounded-sm"
                  rounded
                  v-model="user.last_name"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" xl="6">
                <v-text-field
                  label="Email"
                  filled
                  class="rounded-sm"
                  rounded
                  v-model="user.email"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" xl="6">
                <v-text-field
                  label="Телефон"
                  :prefix="user.username.length > 0 ? '+': ''"
                  v-mask="'7 (###) ### ##-##'"
                  filled
                  class="rounded-sm"
                  rounded
                  v-model="user.username"
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
        user: {
          first_name: '',
          last_name: '',
          email: '',
          username: ''
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
        const data = {
          ...this.user
        };
        data.username = data.username
          .split('(').join('')
          .split(')').join('')
          .split(' ').join('')
          .split('-').join('');
        this.$axios.$put(`${environment.api}/editProfile/${this.user.id ? this.user.id : this.user.pk}`, data, {headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }}).then( (result) => {
          this.user = result;
          localStorage.setItem('user', JSON.stringify(result));
          this.message = 'Информация успешно обновлена';
          this.$store.commit('setUser', result);
        }, (err) => {
          this.message = 'При редактировании произошла ошибка: \n';
          for (const errorKey in err.response.data) {
            if (err.response.data.hasOwnProperty(errorKey)) {
              for (const errorValue of err.response.data[errorKey]) {
                this.message += errorValue + '; \n';
              }
            }
          }
        });
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
