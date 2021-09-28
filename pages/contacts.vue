<template>
  <div class="d-flex flex-column justify-center">
    <div class="page-header">
      <v-container class="d-flex justify-space-between align-center">
        <h1>Контакты</h1>
      </v-container>
    </div>
    <v-container class="page-main">
      <div class="d-lg-flex d-md-flex align-center flex-column">
        <div class="d-flex flex-column align-center w-50">
          <div class="d-flex flex-column align-center w-100">
            <h6>
              <v-icon small color="deep-purple lighten-1">mdi-email</v-icon>
              <span>sportsandshow@gmail.com</span>
            </h6>
            <h6>
              <v-icon small color="deep-purple lighten-1">mdi-phone</v-icon>
              <span>тел.: 8-924-919-3537</span>
            </h6>
            <h6>
              <v-icon small color="deep-purple lighten-1">mdi-phone</v-icon>
              <span>тел.: 8-924-919-3547</span>
            </h6>
          </div>
        </div>
        <v-form
          v-model="valid"
          class="w-75"
        >
          <div class="question d-md-flex d-lg-flex d-none flex-column align-center">
            <span>Есть вопросы?</span>
            <span>Напишите нам</span>
            <span class="mt-md-10 mt-lg-10 mt-5 mb-8">Будем рады ответить на любой ваш вопрос</span>
          </div>
          <v-row>
            <v-col cols="12"
                   md="6"
                   lg="6"
                   sm="6"
                   class="pb-0"
            >
              <v-text-field
                v-model="form.name"
                :rules="nameRules"
                label="Как к вам обращаться?"
                required
                filled
                rounded
                @keypress="send = false"
              ></v-text-field>
            </v-col>
            <v-col cols="12"
                   md="6"
                   lg="6"
                   sm="6"
                   class="pb-0"
            >
              <v-text-field
                v-model="form.email"
                :rules="emailRules"
                label="Ваш электронный адрес"
                required
                filled
                rounded
                @keypress="send = false"
              ></v-text-field>
            </v-col>
            <v-col
              cols="12"
              class="pt-0 pb-0">
              <v-textarea
                solo
                v-model="form.text"
                label="Ваш вопрос"
                @keypress="send = false"
              ></v-textarea>
            </v-col>
          </v-row>
          <transition name="fade">
            <v-alert
              border="left"
              outlined
              color="deep-purple lighten-1"
              v-show="send"
            >
              Спасибо за ваш вопрос, скоро мы его прочитаем и обязательно вам ответим!
            </v-alert>
          </transition>

          <div class="d-flex justify-center mb-5">
            <v-btn
              :disabled="!valid"
              :color="valid ? 'deep-purple lighten-2' : 'secondary'"
              :dark="valid"
              large
              rounded
              elevation="5"
              @click="sendQuestion">Отправить сообщение
            </v-btn>
          </div>

        </v-form>
      </div>
    </v-container>
  </div>
</template>

<script>
import {yandexMap, ymapMarker} from 'vue-yandex-maps'
import {environment} from "assets/environment";

export default {
  components: {yandexMap, ymapMarker},
  auth: false,
  name: "contacts",
  data() {
    return {
      valid: false,
      form: {
        name: '',
        email: '',
        text: ''
      },
      nameRules: [
        v => !!v || 'Заполните ваше имя'
      ],
      emailRules: [
        v => !!v || 'Заполните ваш электронный адрес',
        v => /.+@.+/.test(v) || 'Проверьте правильность написания email',
      ],
      send: false,
      location: [48.480426, 135.087521],
      settings: {
        apiKey: 'c9d5cf84-277c-4432-a839-2e371a6f2e21',
        lang: 'ru_RU',
        version: '2.1'
      }
    }
  },
  methods: {
    sendQuestion() {
      this.$axios.$post(`${environment.api}/feedback`, this.form).then( () => {
        this.send = true;
      }, (err) => {
        this.checkError(err.response);
      });
    }
  }
}
</script>

<style scoped lang="scss">
@import "~/assets/default.scss";

.w-50 {
  padding: 0 20px;
  width: 50%;
}

.ymap-container {
  height: 300px;
  width: 500px;
  margin: 40px 0;
}

.page-header {
  h1 {
    font-family: 'Montserrat Light', sans-serif;
  }
}

form {
  max-width: 50%;
}

.question {
  span:nth-child(1) {
    font-family: 'Montserrat Light', sans-serif;
    font-size: 3rem;
    line-height: 3rem;
  }

  span:nth-child(2) {
    font-family: 'Montserrat Bold', sans-serif;
    font-size: 3rem;
  }
}

.w-100 {
  h6 {
    font-size: 1.1rem;
    letter-spacing: 0.03rem;
    line-height: 2.2rem;

    span {
      margin-left: 10px;
    }
  }
}

.fade-enter-active, .fade-leave-active {
  transition: .4s;
  opacity: 1;
  transform: translateY(0);
}

.fade-enter, .fade-leave-to {
  opacity: 0;
  transition: .4s;
  transform: translateY(-50px);
}
@media (min-width: 960px) and (max-width: 1280px) {
  .ymap-container{
    width: 400px;
  }
}
@media (max-width: 960px) {
  .ymap-container{
    width: 400px;
  }
  .w-50 {
    width: 100%;
    padding: 0;
  }
  form {
    max-width: unset;
  }
  .question {
    span:nth-child(1) {
      font-size: 1.8rem;
      line-height: 2.1rem;
    }

    span:nth-child(2) {
      font-size: 2.2rem;
      line-height: 2.4rem;
    }
  }
  .ymaps {
    height: 30vh;
    width: 100vw;
  }
}
</style>
