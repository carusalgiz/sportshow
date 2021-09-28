<template>
  <div class="d-flex flex-column justify-center">
    <div class="page-header">
      <v-container class="d-flex justify-space-between align-center">
        <h1>Восстановление пароля</h1>
      </v-container>
    </div>
    <div class="page-main">
      <v-container>
        <v-form v-if="!resetSuccess" v-model="resetValid" @submit.prevent="resetPassword">
          <v-col cols="6">
            <v-text-field
              label="Ваш пароль"
              :rules="passwordRules"
              required
              filled
              rounded
              :type="showPass1 ? 'text' : 'password'"
              v-model="new_password1"
              :append-icon="showPass1 ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="showPass1 = !showPass1"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              label="Ваш пароль"
              :rules="passwordRules"
              required
              filled
              rounded
              :type="showPass2 ? 'text' : 'password'"
              v-model="new_password2"
              :append-icon="showPass2 ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="showPass2 = !showPass2"
            ></v-text-field>
          </v-col>
          <div v-if="new_password2 !== new_password1" class="text-center mt-3 mb-3" style="color: red">Пароли не совпадают</div>
          <div v-if="message.trim().length > 0" class="text-center mt-3 mb-3" style="color: red">Пароли не совпадают</div>
          <v-col>
            <div class="d-flex justify-end">
              <v-btn type="submit" :disabled="!resetValid || new_password1 !== new_password2">Восстановить пароль</v-btn>
            </div>
          </v-col>
        </v-form>
        <div class="d-flex justify-center">
          <h3>Пароль успешно восстановлен. Можете войти в учетную запись с новым паролем</h3>
        </div>
      </v-container>
    </div>
  </div>
</template>

<script>
import {environment} from "assets/environment";

export default {
  name: "_token",
  data() {
    return {
      passwordRules: [
        v => !!v || 'Заполните ваш пароль'
      ],
      new_password1: '',
      new_password2: '',
      showPass1: false,
      showPass2: false,
      resetValid: false,
      resetSuccess: false,
      message: ''
    }
  },
  methods: {
    resetPassword() {
      const data = {
        uid: this.$route.params.uid,
        token: this.$route.params.token,
        new_password1: this.new_password1,
        new_password2: this.new_password2
      };
      this.$axios.post(`${environment.api}/password/reset/confirm`, data).then(() => {
        this.resetSuccess = true;
      }, (error) => {
        this.message = error;
      });
    }
  }
}
</script>

<style scoped>

</style>
