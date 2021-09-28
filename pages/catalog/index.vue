<template>
  <div class="d-flex flex-column justify-center">
    <div class="page-header">
      <v-container class="d-flex justify-space-between align-center">
        <h1>Каталог</h1>
      </v-container>
    </div>
    <v-container class="page-main">
      <v-row>
        <v-col cols="12" sm="6" md="3" lg="3">
          <NuxtLink to="/catalog/sredstva-gigieny-i-kosmetika" class="dark-link">
            <v-card
              elevation="2">
              <div class="no-photo-bg">
                <v-img
                  height="250" :src="require('~/static/categories/средства гигиены и косметика.jpg')"
                ></v-img>
              </div>
              <v-card-title class="justify-center text-center">
                  <span>Средства гигиены и <br/> косметика</span>
              </v-card-title>
            </v-card>
          </NuxtLink>
        </v-col>
        <v-col cols="12" sm="6" md="3" lg="3">
          <NuxtLink to="/catalog/soderzhanie" class="dark-link">
            <v-card
              elevation="2">
              <div class="no-photo-bg">
                <v-img
                  height="250" :src="require('~/static/categories/Содержание.jpg')"
                ></v-img>
              </div>
              <v-card-title class="justify-center">
                <span>Содержание</span>
              </v-card-title>
            </v-card>
          </NuxtLink>
        </v-col>
        <v-col cols="12" sm="6" md="3" lg="3">
          <NuxtLink to="/catalog/korma" class="dark-link">
            <v-card
              elevation="2">
              <div class="no-photo-bg">
                <v-img
                  height="250" :src="require('~/static/categories/Корма.jpg')"
                ></v-img>
              </div>
              <v-card-title class="justify-center">
                <span>Корма</span>
              </v-card-title>
            </v-card>
          </NuxtLink>
        </v-col>
        <v-col cols="12" sm="6" md="3" lg="3">
          <NuxtLink to="/catalog/vitaminy" class="dark-link">
            <v-card
              elevation="2">
              <div class="no-photo-bg">
                <v-img
                  height="250" :src="require('~/static/categories/Витамины.jpg')"
                ></v-img>
              </div>
              <v-card-title class="justify-center">
                <span>Витамины</span>
              </v-card-title>
            </v-card>
          </NuxtLink>
        </v-col>
      </v-row>
      <div class="d-flex mt-5 mb-2 justify-center" v-if="searchListOpen"><h3>Найдено товаров: {{pagination.count}}</h3></div>
      <v-row class="w-100" style="margin: 0 !important;" v-if="searchListOpen && items.length > 0">
    	<v-col
    		cols="4"
            v-for="(item, index) of items" :key="item.code">
            <item-for-list :listType="'grid'" :item="item"></item-for-list>
          </v-col>
      </v-row>
      <div class="text-center" v-if="searchListOpen">
        <v-pagination
          v-model="pagination.page"
          :length="pagination.totalPages"
          @input="getItems"
        ></v-pagination>
      </div>
    </v-container>
  </div>
</template>

<script>
    import {environment} from "../../assets/environment";
    export default {
      auth: false,
      head() {
        return {
          title: this.$route.params.catalog
        }
      },
        name: "index",
        data() {
        	return {
        		search: this.$route.query.search,
        		searchListOpen: false,
        		items: [],
        		pagination: {
		            page: 1,
		            count: 0,
		            limit: '12',
		            totalPages: 0
		          }
        	}
        },
        methods: {
        	getItems() {
        		this.searchListOpen = false;
	        	this.page = 1;
	        	this.limit = '12';
        		this.$axios.get(`${environment.api}/search?q=${this.$route.query.search}&page=${this.pagination.page}&limit=${this.pagination.limit}`).then( res => {
        			if (res) {
	        			this.items = res.data.results;
	        			this.pagination.count = res.data.count;
        				this.pagination.totalPages = res.data.total_pages;
	        			this.searchListOpen = true;
        			}
        		});
        	}
        },
        mounted() {
        	if (this.$route.query.search) {
        		this.getItems();
        	} else {
        		this.searchListOpen = false;
        	}
        },
		watch:{
		    $route (to, from){
		    	if (this.$route.query.search) {
	        		this.getItems();
	        	} else {
	        		this.searchListOpen = false;
	        	}
		    }
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
