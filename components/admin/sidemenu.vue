<template>
  <v-card
    width="350"
  >
    <v-navigation-drawer
      class="side-menu"
      floating
      permanent>
      <div class=" h-100 d-flex flex-column justify-space-between">
        <v-list
          class="menu"
          dense
          nav
        >
          <v-list-item
            v-for="item in items"
            :key="item.title"
            link
            class="d-flex menu-item"
            :to="item.href"
            color="primary"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title class="item-title">{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>


      </div>
    </v-navigation-drawer>
  </v-card>
</template>

<script>
  import {environment} from "../../assets/environment";
  import Titles from '../../models/adminPageTitles'

  export default {
    name: "sidemenu",
    data() {
      return {
        user: null,
        items: [
          {title: 'Заказы', icon: 'mdi-cash-usd', href: '/admin/orders'},
          {title: 'Статьи и новости', icon: 'mdi-message-text-outline', href: '/admin/articles'},
          {title: 'Реклама', icon: 'mdi-message-text-outline', href: '/admin/advertising'},
          {title: 'Товары', icon: 'mdi-paw', href: '/admin/categories'},
          {title: 'Пользователи', icon: 'mdi-account-group', href: '/admin/users'},
          {title: 'SMS-центр', icon: 'mdi-account-group', href: '/admin/smsc'},
        ],
        right: null,
      }
    },
    mounted() {
      this.user = this.$store.state.user;
      console.log(this.user)
    },
  }
</script>

<style scoped lang="scss">
  @import "~/assets/default.scss";
  .side-menu {
    background: linear-gradient(to top, #ceb0fb, #bdf);
    width: 100% !important;
    .header{
      height: 69px;
    }
    .item-title{
      font-family: "Montserrat Bold", sans-serif !important;
      font-size: 1.1rem;
    }
    .menu-item{
      text-decoration: none;
    }
  }
</style>
