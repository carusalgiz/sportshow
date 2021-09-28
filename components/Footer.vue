<template>
    <div class="footer d-flex justify-center">
      <v-container class="d-flex justify-space-between">
        <ul>
          <li><NuxtLink class="custom-active" to="/contacts">Контакты</NuxtLink></li>
          <li><NuxtLink class="custom-active" to="/delivery">Оплата и доставка</NuxtLink></li>
          <li><NuxtLink class="custom-active" to="/contacts">Обратная связь</NuxtLink></li>
          <li><NuxtLink class="custom-active" to="/agreement">Пользовательское соглашение</NuxtLink></li>
        </ul>
        <ul>
          <li class="d-flex">
            <v-icon small color="white">mdi-email</v-icon>
            <span class="ml-2">sportsandshow@gmail.com</span>
          </li>
          <li class="d-flex">
            <v-icon small color="white">mdi-phone</v-icon>
            <span class="ml-2">тел.: 8-924-919-3537</span>
          </li>
          <li class="d-flex">
            <v-icon small color="white">mdi-phone</v-icon>
            <span class="ml-2">тел.: 8-924-919-3547</span>
          </li>
        </ul>
      </v-container>
    </div>
</template>

<script>
    export default {
      auth: false,
      name: "Footer"
    }
</script>

<style scoped lang="scss">
  @import "assets/fonts";
  .footer{
    max-height: 220px;
    width: 100%;
    background-color: #222;
  }
  ul{
    list-style: none;

    & > li, .custom-active, .custom-active > a{
      text-decoration: none;
      color: lightgray;
      font-family: "Montserrat Bold", sans-serif;
      font-size: 15px;
      margin: 10px 0;
      transition: .1s;

      &:hover{
        color: gray;
        cursor: pointer;
      }
    }
  }
</style>
