<template>
  <div class="d-flex flex-column justify-center">
    <div class="page-header">
      <v-container class="d-flex justify-space-between align-center">
        <h1>{{category.name}}</h1>
      </v-container>
    </div>
    <v-container class="page-main">
      <v-row>
        <v-col cols="12" sm="6" md="3" lg="3" v-for="group of category.subs" :key="group.link">
          <NuxtLink :to="$route.path + '/' + group.link" class="dark-link">
            <v-card
              elevation="2">
              <div class="no-photo-bg">
                <v-img
                  height="250" :src="'../' + group.pic"
                ></v-img>
              </div>
              <v-card-title class="justify-center">
                <span style="word-break: break-word;text-align: center;">{{group.name}}</span>
              </v-card-title>
            </v-card>
          </NuxtLink>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
    import {categories} from "../../../static/data";

    export default {
      auth: false,
      head() {
        return {
          title: this.category.name
        }
      },
      name: "Catalog",
      data() {
        return {
          category: {
            name: '',
            link: '',
            pic: '',
            subs: []
          }
        }
      },
      mounted() {
        this.category = categories.filter(cat => cat.link === this.$route.params.category)[0];
      }
    }
</script>

<style scoped lang="scss">
  @import "~/assets/catalog.scss";
  @import "~/assets/default.scss";
  .page-header{
    h1{
      font-family: 'Montserrat Light', sans-serif;
    }
  }
</style>
