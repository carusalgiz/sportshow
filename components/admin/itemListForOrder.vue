<template>
    <div>
      <div class="d-flex">
        <v-select
          :items="categories"
          v-model="currentCategory"
          item-text="name"
          item-value="link"
          label="Категория"
          return-object
          solo
          @change="setSubCategory"
          class="mr-3"
        >
        </v-select>
        <v-select
          :items="currentCategory.subs"
          v-model="currentSubCategory"
          item-text="name"
          item-value="link"
          label="Подкатегория"
          return-object
          solo
          :disabled="currentCategory.subs.length === 0"
          @change="loadItems"
        >
        </v-select>
      </div>
      <v-list nav dense>
          <v-list-item v-for="(cat,index) of items" :key="index">
            <div class="d-flex w-100 justify-space-between align-center">
              <div><span>{{cat.option.code}} • </span><span> {{cat.data.name}} • </span><span class="purple--text"><b>{{cat.option.option}}</b></span></div>
              <v-btn icon outlined color="primary" @click="selectItem(cat)">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </div>
          </v-list-item>
      </v-list>
    </div>
</template>

<script>
    import {categories} from "../../static/data";
    import {environment} from "../../assets/environment";

    export default {
      name: "itemListForOrder",
      data() {
        return{
          categories: categories,
          currentCategory: {
            name: '',
            link: '',
            subs: []
          },
          currentSubCategory: null,
          items: [],
        }
      },
      mounted() {
        this.currentCategory = this.categories[0];
        this.setSubCategory();
      },
      methods: {
        checkError(error) {
          if (error.status === 401 || error.status === 403) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            this.$store.commit('setLoginState', false);
            this.$store.commit('setIsAdmin', false);
            this.$store.commit('setUser', null);
            this.$router.push('/admin');
          }
        },
        setSubCategory() {
          if (this.currentCategory.subs.length !== 0) {
            this.currentSubCategory = this.currentCategory.subs[0];
          }
          this.loadItems();
        },
        loadItems() {
          this.$axios.get(`${environment.api}/admin/categories?section=${this.currentCategory.link}&subsection=${this.currentSubCategory.link}`,
            {headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
              }}).then( res => {
              this.items = res.data.results.map(elem => {
                      return elem.categories.map( cat => {
                        return {
                          count: 1,
                          data: elem,
                          id: elem.id,
                          option: cat,
                          path: `catalog/${elem.section}/${elem.subsection}/${elem.slug}`
                        }
                      })
                    }).flat()
            console.log(this.items);
          }, (err) => {
            this.checkError(err.response);
          })
        },
        selectItem(item) {
          this.$emit('addItem', item)
        }
      }
    }
</script>

<style scoped>
  @import "~/assets/default.scss";
</style>
