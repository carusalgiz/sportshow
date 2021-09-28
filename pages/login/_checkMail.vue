<template>
  <div class="d-flex flex-column justify-center">
    <div class="page-header">
      <v-container class="d-flex justify-space-between align-center">
        <h1>Подтверждение почты</h1>
      </v-container>
    </div>
    <v-container class="page-main pb-0">
      <div class="d-flex justify-center">
        <h3>{{message}}</h3>
      </div>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "checkMail",
  data() {
    return {
      message: ''
    }
  },
  mounted() {
    if (location.href.includes('checkMail=true')) {
      this.message = 'Ваша почта успешно подтвреждена. Теперь вы можете войти в свою учетную запись';
    } else {
      this.message = 'При подтверждении почты произошла ошибка. Повторите попытку позднее.'
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
.page-header {
  h1 {
    font-family: 'Montserrat Light', sans-serif;
  }
}
.page-main{
  font-family: 'Montserrat', sans-serif;
  p{
    font-size: 18px;
    line-height: 30px;
    letter-spacing: 0.02em;
    margin: 15px 0;
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
</style>
