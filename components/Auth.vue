<template>
  <div class="auth-wrapper pa-5" v-bind:class="{'mobile':mobile}">
    <div class="d-flex flex-column align-center">
      <div class="triangle" v-if="!mobile"></div>
      <div class="d-flex w-100 justify-end exit">
        <v-btn icon tile @click="closeAuth" large>
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
      <template v-if="mode === 'login'">
        <span class="login-title mb-4">Вход</span>
        <v-form v-model="loginValid" class="w-100" @submit.prevent="userLogin">
          <v-text-field
            v-if="loginType === 'phone'"
            label="Ваш телефон"
            :rules="usernameRules"
            required
            :prefix="auth.username.length > 0 ? '+': ''"
            v-mask="'7 (###) ### ##-##'"
            filled
            rounded
            v-model="auth.username"
          ></v-text-field>
          <v-text-field
            v-if="loginType === 'email'"
            label="Ваш email"
            :rules="emailRules"
            required
            filled
            rounded
            v-model="auth.email"
          ></v-text-field>
          <div v-if="loginType === 'phone'" class="w-100 d-flex justify-center mb-5">
            <span class="auth-link" @click="loginType = 'email'">Войти по email?</span>
          </div>
          <div v-if="loginType === 'email'" class="w-100 d-flex justify-center mb-5">
            <span class="auth-link" @click="loginType = 'phone'">Войти по номеру телефона?</span>
          </div>
          <v-text-field
            label="Ваш пароль"
            :rules="passwordRules"
            required
            filled
            rounded
            :type="showPassLogin ? 'text' : 'password'"
            v-model="auth.password"
            :append-icon="showPassLogin ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassLogin = !showPassLogin"
          ></v-text-field>
          <div class="d-flex justify-center">
            <span class="auth-link" @click="resetPassword">Забыли пароль?</span>
          </div>
          <span class="text-success">{{loginMessage}}</span>
          <div class="d-flex flex-column align-center">
            <v-btn color="primary" large tile class="mb-3" :disabled="!loginValid" type="submit">Войти</v-btn>
            <span class="auth-link" @click="mode = 'register'">Еще не зарегистрированы? <br/>Зарегистрироваться</span>
          </div>
        </v-form>
      </template>
      <template v-if="mode === 'reset'">
        <v-form>
          <span class="auth-link mb-2" @click="mode = 'login'">Вернуться на форму входа</span>
          <v-text-field
            label="Ваш телефон"
            :rules="usernameRules"
            required
            :prefix="resetForm.username.length > 0 ? '+': ''"
            v-mask="'7 (###) ### ##-##'"
            filled
            rounded
            v-model="resetForm.username"
          ></v-text-field>
          <v-text-field
            label="Код восстановления"
            :rules="usernameRules"
            required
            filled
            rounded
            v-model="resetForm.code"
          ></v-text-field>
          <v-text-field
            label="Пароль"
            :rules="passwordRules"
            required
            filled
            rounded
            :type="showPassLogin ? 'text' : 'password'"
            v-model="resetForm.new_password1"
            :append-icon="showPassLogin ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassLogin = !showPassLogin"
          ></v-text-field>
          <v-text-field
            label="Повторите пароль"
            :rules="passwordRules"
            required
            filled
            rounded
            :type="showPassLogin ? 'text' : 'password'"
            v-model="resetForm.new_password2"
            :append-icon="showPassLogin ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassLogin = !showPassLogin"
          ></v-text-field>
          <div class="d-flex justify-end" @click="resetPasswordByPhone">
            <v-btn>Восстановить пароль</v-btn>
          </div>
        </v-form>
      </template>
      <template v-if="mode === 'register'">
        <span class="login-title mb-4">Регистрация</span>
        <v-form v-model="registerValid" class="w-100" @submit.prevent="userRegister">
          <v-text-field v-if="registerType === 'phone'"
            label="Ваш телефон"
            :rules="usernameRules"
            :prefix="register.username.length > 0 ? '+': ''"
            v-mask="'7 (###) ### ##-##'"
            required
            filled
            rounded
            v-model="register.username"
          ></v-text-field>
          <v-text-field
            v-if="registerType === 'email'"
            label="Ваш email"
            :rules="emailRules"
            required
            filled
            rounded
            v-model="register.email"
          ></v-text-field>
          <div v-if="registerType === 'phone'" class="w-100 d-flex justify-center mb-5">
            <span class="auth-link" @click="registerType = 'email'">Зарегистрироваться по email?</span>
          </div>
          <div v-if="registerType === 'email'" class="w-100 d-flex justify-center mb-5">
            <span class="auth-link" @click="registerType = 'phone'">Зарегистрироваться по номеру телефона?</span>
          </div>
          <v-text-field
            label="Ваш пароль"
            :rules="passwordRules"
            required
            filled
            rounded
            :type="showPass1Register ? 'text' : 'password'"
            v-model="register.password1"
            :append-icon="showPass1Register ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPass1Register = !showPass1Register"
          ></v-text-field>
          <v-text-field
            label="Повторите пароль"
            :rules="passwordRules"
            required
            filled
            rounded
            :type="showPass2Register ? 'text' : 'password'"
            v-model="register.password2"
            :append-icon="showPass2Register ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPass2Register = !showPass2Register"
          ></v-text-field>

          <v-text-field
            v-if="codeSended"
            v-model="register.checkCode"
            label="Введите код подтверждения из смс"
          ></v-text-field>
          <v-btn color="primary" class="w-100 mt-2 mb-5" v-if="codeSended" @click="approve">Отправить код</v-btn>
          <span class="text-success">{{registerMessage}}</span>
          <div class="d-flex flex-column align-center mt-5">
            <v-btn
              v-if="!codeSended"
              color="primary" large tile class="mb-3" :disabled="!registerValid" type="submit">Зарегистрироваться
            </v-btn>
            <span class="auth-link" @click="mode = 'login'">Уже зарегистрированы? <br/>Войти</span>
          </div>
        </v-form>
      </template>
    </div>
  </div>
</template>

<script>
  import {environment} from '../assets/environment';
  export default {
    auth: false,
    name: "Auth",
    props: ['mobile'],
    data() {
      return {
        loginMessage: '',
        registerMessage: '',
        loginValid: false,
        registerValid: false,
        showPass1Register: false,
        showPass2Register: false,
        showPassLogin: false,
        mode: 'login',
        registerType: 'phone',
        loginType: 'phone',
        codeSended: false,
        resetFormByPhoneOpen: false,
        auth: {
          email: '',
          username: '',
          password: ''
        },
        resetForm: {
          username: '',
          code: '',
          new_password1: '',
          new_password2: ''
        },
        register: {
          password1: '',
          password2: '',
          checkCode: '',
          email: '',
          username: ''
        },
        smsResetSended: false,
        usernameRules: [
          v => !!v || 'Заполните ваш телефон'
        ],
        passwordRules: [
          v => !!v || 'Заполните ваш пароль'
        ],
        phoneFieldMessage: '',
        emailRules: [
          v => !!v || 'Заполните ваш электронный адрес',
          v => /.+@.+/.test(v) || 'Проверьте правильность написания email',
        ],
      }
    },
    mounted() {
      if (location.href.includes('checkMail=true')) {
        this.loginType = 'email';
      }
      this.checkToken();
    },
    methods: {
      resetPassword() {
        if (this.loginType === 'email') {
          if (this.auth.email.trim().length === 0) {
            this.loginMessage = 'Для восстановления пароля заполните, пожалуйста, поле email'
          } else {
            this.$axios.post(`${environment.api}/password/reset/`, {email: this.auth.email}).then(res => {
              this.loginMessage = 'Ссылка для восстановления пароля отправлена на указанную почту';
            }, (error) => {
              this.loginMessage = error;
            });
          }
        } else {
          if (this.auth.username.trim().length === 0) {
            this.loginMessage = 'Для восстановления пароля заполните, пожалуйста, поле телефон'
          } else {
            const phone = this.auth.username.split('(').join('').split(')').join('').split(' ').join('').split('-').join('').trim();
            console.log(phone);
            this.$axios.get(`${environment.api}/password-username/reset?username=${phone}`).then(res => {
              this.resetForm.username = this.auth.username;
              this.loginMessage = 'Код для восстановления пароля отправлен на указанный телефон';
              this.mode = 'reset';
            }, (error) => {
              this.loginMessage = error;
            });
          }
        }
      },
      resetPasswordByPhone() {
        const data = {
          username: this.resetForm.username.split('(').join('').split(')').join('').split(' ').join('').split('-').join('').trim(),
          code: this.resetForm.code,
          new_password1: this.resetForm.new_password1,
          new_password2: this.resetForm.new_password2
        };
        this.$axios.post(`${environment.api}/password-username/reset/check`, data).then(res => {
          this.mode = 'login';
          this.loginMessage = 'Пароль успешно восстановлен. Вы можете войти в учетную запись с новым паролем.'
        }, () => {

        });
      },
      checkToken() {
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
        }
      },
      approve() {
        const data = {
          username: this.register.username.split('(').join('').split(')').join('').split(' ').join('').split('-').join(''),
          code: this.register.checkCode
        }
        this.$axios.post(`${environment.api}/check`, data).then(res => {
          this.mode = 'login';
          const loginData = {
            password: this.register.password1,
            username: this.register.username.split('(').join('').split(')').join('').split(' ').join('').split('-').join('')
          };
          this.$axios.post(`${environment.api}/login/`, loginData).then(res => {
            localStorage.setItem('token', res.data.access_token);
            localStorage.setItem('refresh_token', res.data.refresh_token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            this.loginMessage = 'Успешный вход!';
            this.$store.commit('setLoginState',true);
            this.$store.commit('setToken',res.data.access_token);
            this.$store.commit('setUser', res.data.user);
            this.$store.commit('setIsAdmin', res.data.user.is_staff);
          }, err => {
            this.loginMessage = 'При входе произошла ошибка';
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            this.$store.commit('setLoginState',false);
            this.$store.commit('setToken', null);
            this.$store.commit('setUser', null);
            this.$store.commit('setIsAdmin', false);
          });
          this.registerMessage = 'Регистрация прошла успешно, теперь вы можете войти в свою учетную запись';
        }, (error) => {
          if (error.message === 'Code expired, sended new code') {
            this.registerMessage = 'Истекло время действия кода подтверждения'
          }
          if (error.message === 'Wrong params') {
            this.registerMessage = 'Проверьте правильность введенных данных'
          }
          localStorage.removeItem('token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          this.$store.commit('setLoginState',false);
          this.$store.commit('setToken', null);
          this.$store.commit('setUser', null);
          this.$store.commit('setIsAdmin', false);
        });
      },
      userLogin() {
        const data = {
          password: this.auth.password
        };
        if (this.loginType === 'email') {
          data.email = this.auth.email;
        } else {
          data.username = this.auth.username.split('(').join('').split(')').join('').split(' ').join('').split('-').join('');
        }

        this.$axios.post(`${environment.api}/login`, data).then(res => {
          localStorage.setItem('token', res.data.access_token);
          localStorage.setItem('refresh_token', res.data.refresh_token);
          localStorage.setItem('user', JSON.stringify(res.data.user));
          this.$store.commit('setLoginState',true);
          this.$store.commit('setToken',res.data.access_token);
          this.$store.commit('setUser', res.data.user);
          this.$store.commit('setIsAdmin', res.data.user.is_staff);
          this.loginMessage = 'Успешный вход!';
        }, (err) => {
          this.loginMessage = 'При входе произошла ошибка: \n';
          for (const errorKey in err.response.data) {
            if (err.response.data.hasOwnProperty(errorKey)) {
              for (const errorValue of err.response.data[errorKey]) {
                this.loginMessage += errorValue + '; \n';
              }
            }
          }
          localStorage.removeItem('token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          this.$store.commit('setLoginState',false);
          this.$store.commit('setToken', null);
          this.$store.commit('setUser', null);
          this.$store.commit('setIsAdmin', false);
        });
      },
      userRegister() {
        const data = {
          password1: this.register.password1,
          password2: this.register.password2
        };
        if (this.registerType === 'email') {
          data.email = this.register.email;
        } else {
          data.username = this.register.username.split('(').join('').split(')').join('').split(' ').join('').split('-').join('');
        }
        this.$axios.post(`${environment.api}/signup`, data).then(res => {
          if (this.registerType === 'email') {
            this.loginType = 'email';
            this.mode = 'login';
            this.loginMessage = 'На вашу почту отправлена ссылка для подтвеждения учетной записи';
            this.auth = {
              username: this.register.email,
              password: this.register.password1
            }
          } else {
            this.registerMessage = 'На ваш телефон отправлен код подтверждения';
            this.codeSended = true;
          }
        }, err => {
          this.registerMessage = '';
          for (const errorKey in err.response.data) {
            if (err.response.data.hasOwnProperty(errorKey)) {
              for (const errorValue of err.response.data[errorKey]) {
                this.registerMessage += errorValue + '; \n';
              }
            }
          }
        });
      },
      closeAuth() {
        this.$emit('closeAuth');
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "~/assets/default.scss";

  * {
    font-family: 'Montserrat', sans-serif;
  }

  .text-success {
    color: #3b8070;
  }

  .auth-link {
    color: black;
    transition: .2s;
    text-align: center;

    &:hover {
      color: dodgerblue;
      cursor: pointer;
    }
  }

  .exit {
    margin-bottom: -44px;
    position: relative;
    top: -20px;
  }

  .auth-wrapper {
    position: absolute;
    width: 350px;
    background-color: rgb(255 255 255);
    border-radius: 8px;
    left: -135px;
    box-shadow: 0 0 15px 0px #626677;
    &.mobile{
      position: unset;
      width: 100%;
      box-shadow: unset;
    }
  }

  .login-title {
    font-size: 26px;
    color: black;
  }

  .triangle {
    border-top: 15px solid transparent;
    border-bottom: 15px solid white;
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
    position: relative;
    top: -50px;
    margin-bottom: -20px;
  }
</style>
