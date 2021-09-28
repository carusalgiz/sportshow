<template>
  <div class="d-flex flex-column justify-center">
    <div class="page-header">
      <v-container class="d-flex justify-space-between align-center">
        <h1>{{subCategory}}</h1>
      </v-container>
    </div>
    <div class="page-main">
      <items-list></items-list>
    </div>
  </div>
</template>

<script>
    import ItemsList from "../../../../components/ItemsList";
    import {categories} from "../../../../static/data";
    export default {
      auth: false,
      components: {ItemsList},
      head() {
        return {
          title: this.subCategory
        }
      },
      name: "Category",
      data() {
        return {
          subCategory: ''
        }
      },
      mounted() {
        this.subCategory = categories.filter(cat => cat.link === this.$route.params.category)[0].subs.filter(subCat =>
          subCat.link === this.$route.params.subCategory)[0].name;
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
