<template>
    <v-container>
      <div class="d-md-flex d-lg-flex d-none d-sm-none w-100">
        <div class="filters">
          <div class="d-flex align-center list-head">
            <h2>Фильтры</h2>
          </div>
          <v-divider></v-divider>
          <div class="mt-7">
            <span>Цена:</span>
            <v-range-slider
              color="primary"
              :min="minPrice"
              :max="maxPrice"
              v-model="priceRange"
              :step="0.1"
            >
            </v-range-slider>
            <div class="d-flex justify-space-between price-fields">
              <v-text-field class="ma-0 pa-0" style="max-width: 70px;" v-model="priceRange[0]"></v-text-field>
              <v-text-field class="ma-0 pa-0" style="max-width: 70px;" v-model="priceRange[1]"></v-text-field>
            </div>
          </div>
          <div class="mt-4">
            <div class="mb-3">Производитель:</div>
            <v-checkbox
              v-for="(w) of brands"
              :key="w"
              v-model="filters.brand"
              hide-details
              :label="w"
              :value="w"
              class="ma-0"
            ></v-checkbox>
          </div>
          <div class="mt-4" v-if="$route.params.category === 'korma' || $route.params.category === 'vitaminy'">
            <div class="mb-3">Возраст:</div>
            <v-checkbox
              v-for="(w) of ages"
              :key="w.value"
              v-model="filters.age"
              hide-details
              :label="w.name"
              :value="w.name"
              class="ma-0"
            ></v-checkbox>
          </div>
          <div class="mt-4" v-if="$route.params.category === 'korma'">
            <div class="mb-3">Вкус корма:</div>
            <v-checkbox
              v-for="(w) of flavors"
              :key="w.value"
              v-model="filters.flavor"
              hide-details
              :label="w.name"
              :value="w.name"
              class="ma-0"
            ></v-checkbox>
          </div>
          <div class="mt-4">
            <div class="mb-3">Размер животного:</div>
            <v-checkbox
              v-for="(w) of sizes"
              :key="w.value"
              v-model="filters.size"
              hide-details
              :label="w.name"
              :value="w.name"
              class="ma-0"
            ></v-checkbox>
          </div>
          <div class="d-flex flex-column justify-center mt-5">
            <v-btn
              rounded
              color="primary"
              class="mb-4"
              @click="showList('show')"
              large>
              Показать
            </v-btn>
            <v-btn
              @click="showList('reset')"
              rounded
              large>
              Сбросить
            </v-btn>
          </div>

        </div>
        <div class="list pl-7">
          <div class="d-flex list-head">
            <div class="d-flex align-center">
              <v-btn
                class="ml-1 mr-1"
                :color="listType === 'grid' ? 'primary' : 'white'"
                @click="listType = 'grid'"
                :elevation="listType === 'grid' ? 3 : 0"
                small
                fab
              ><v-icon dark>mdi-grid</v-icon></v-btn>
              <v-btn
                class="ml-1 mr-1"
                :color="listType === 'list' ? 'primary' : 'white'"
                @click="listType = 'list'"
                fab
                small
                :elevation="listType === 'list' ? 3 : 0"
              ><v-icon dark>mdi-format-list-bulleted</v-icon></v-btn>
            </div>
            <div class="d-flex align-center">
              <span class="mr-4 ml-10">На странице:</span>
              <div style="width: 80px">
                <v-select
                  :items="countList"
                  v-model="pagination.limit"
                  @change="loadList"
                ></v-select>
              </div>
            </div>
            <div class="d-md-flex d-lg-flex d-none align-center">
              <span class="mr-4 ml-10">Сортировка:</span>
              <div style="width: 200px">
                <v-select
                  :items="sortList"
                  v-model="filters.sort"
                  item-text="name"
                  item-value="value"
                  @change="loadList"
                ></v-select>
              </div>
            </div>
          </div>
          <v-divider></v-divider>
          <transition-group name="fade">
            <v-container v-if="!loading" key="loadedList" class="w-100">
              <div v-if="list.length > 0">
                <v-row class="w-100" style="margin: 0 !important;">
                  <v-col
                    :cols="listType === 'grid' ? 4 : 12"
                    v-for="(item, index) of list" :key="item.code">
                    <item-for-list :listType="listType" :item="item"></item-for-list>
                  </v-col>
                </v-row>
                <div class="text-center">
                  <v-pagination
                    v-model="pagination.page"
                    :length="pagination.totalPages"
                    @input="loadList"
                  ></v-pagination>
                </div>
              </div>
              <div class="d-flex justify-center mt-5" v-else>
                <h1 class="grey--text">Товары не найдены</h1>
              </div>
            </v-container>
          </transition-group>
        </div>

      </div>
      <div class="d-flex d-sm-flex d-md-none d-lg-none mobile-page flex-column">
        <div class="d-flex w-100">
          <div class="d-flex align-center">
            <span class="mr-3">На странице:</span>
            <div style="width: 50px">
              <v-select
                :items="countList"
                v-model="pagination.limit"
                  @change="loadList"
              ></v-select>
            </div>
          </div>
          <div class="d-flex flex-grow-1 align-center justify-end">
            <v-btn
              class="ml-1 mr-1"
              :color="mobileFilterOpen ? 'pink' : 'black'"
              @click="mobileFilterOpen = !mobileFilterOpen"
              fab
              small
              icon
            ><v-icon dark>mdi-filter</v-icon></v-btn>
          </div>
        </div>
        <transition name="fade">
          <div v-show="mobileFilterOpen" class="mobile-list-filters pa-5">
            <span>Сортировка:</span>
            <v-select
              :items="sortList"
              v-model="filters.sort"
              item-text="name"
              item-value="value"
              class="pt-0 mt-0"
              @change="loadList"
            ></v-select>
            <span>Цена:</span>
            <v-range-slider
              color="primary"
              :min="minPrice"
              :max="maxPrice"
              v-model="priceRange"
              :step="0.1"
            >
            </v-range-slider>
            <div class="d-flex justify-space-between price-fields">
              <v-text-field class="ma-0 pa-0" style="max-width: 70px;" v-model="priceRange[0]"></v-text-field>
              <v-text-field class="ma-0 pa-0" style="max-width: 70px;" v-model="priceRange[1]"></v-text-field>
            </div>
            <div class="mb-3 mt-4">Производитель:</div>
            <v-checkbox
              v-for="(w) of brands"
              :key="w"
              v-model="filters.brand"
              hide-details
              :label="w"
              :value="w"
              class="ma-0"
            ></v-checkbox>
            <div class="mt-4" v-if="$route.params.category === 'korma' || $route.params.category === 'vitaminy'">
              <div class="mb-3">Возраст:</div>
              <v-checkbox
                v-for="(w) of ages"
                :key="w.value"
                v-model="filters.age"
                hide-details
                :label="w.name"
                :value="w.value"
                class="ma-0"
              ></v-checkbox>
            </div>
            <div class="mt-4" v-if="$route.params.category === 'korma'">
              <div class="mb-3">Вкус корма:</div>
              <v-checkbox
                v-for="(w) of flavors"
                :key="w.value"
                v-model="filters.flavor"
                hide-details
                :label="w.name"
                :value="w.value"
                class="ma-0"
              ></v-checkbox>
            </div>
            <div class="mt-4">
	            <div class="mb-3">Размер животного:</div>
	            <v-checkbox
	              v-for="(w) of sizes"
	              :key="w.value"
	              v-model="filters.size"
	              hide-details
	              :label="w.name"
	              :value="w.name"
	              class="ma-0"
	            ></v-checkbox>
            </div>
            <div class="d-flex flex-column justify-center mt-5">
              <v-btn
                rounded
                color="primary"
                class="mb-4"
                @click="showList('show')"
                large>
                Показать
              </v-btn>
              <v-btn
                rounded
                @click="showList('reset')"
                large>
                Сбросить
              </v-btn>
            </div>
          </div>
        </transition>
        <transition-group name="fade">
          <v-container v-if="loading" key="skeleton" class="w-100">
            <v-sheet
              color="grey lighten-4"
              class="pa-3"
            >
              <v-skeleton-loader
                class="mx-auto"
                type="card"
              ></v-skeleton-loader>
            </v-sheet>
          </v-container>
          <v-container v-if="!loading" key="loadedList" class="w-100">
            <div v-if="list.length > 0">
              <item-for-list :sort="filters.sort"
                             class="mb-4"
                             v-for="(item) of list" :key="item.code" :item="item"></item-for-list>
              <div class="text-center">
                <v-pagination
                  v-model="pagination.page"
                  :length="pagination.totalPages"
                  @input="loadList"
                ></v-pagination>
              </div>
            </div>
            <div class="d-flex justify-center mt-5" v-else>
              <h1 class="grey--text">Товары не найдены</h1>
            </div>
          </v-container>
        </transition-group>
      </div>
    </v-container>
</template>

<script>
  import {environment} from "../assets/environment";
  import {age, flavor, sizes} from "../static/data";
  import ItemForList from "./itemForList";

  export default {
    components: {ItemForList},
    auth: false,
    name: "ItemsList",
    data() {
        return{
          mobileFilterOpen: false,
          list: [],
          loading: false,
          countList: ['12','24','36','52'],
          minPrice: 0,
          maxPrice: 50000,
          priceRange: [0, 50000],
          filters: {
            sort: null,
            brand: [],
            age: [],
            flavor: [],
            size: []
          },
          ages: age,
          flavors: flavor,
          sizes: sizes,
          pagination: {
            page: 1,
            count: 0,
            limit: '12',
            totalPages: 0
          },
          sortList: [
            {
              name: 'По убыванию цены',
              value: 'minPrice'
            },
            {
              name: 'По возрастанию цены',
              value: '-maxPrice'
            }
          ],
          weightList: [
            {
              name: '1.6кг',
              value: '1.6'
            },
            {
              name: '5.45кг',
              value: '5.45'
            },
            {
              name: '10кг',
              value: '10'
            }
          ],
          weight: [],
          listType: 'grid',
          brands: []
        }
      },
    mounted() {
      this.filters.sort = this.sortList[0].value;
      this.loadList();
      this.$axios.get(`${environment.api}/filters/${this.$route.params.category}/${this.$route.params.subCategory}`).then( res => {
        this.brands = res.data.producer ? res.data.producer.filter(elem => elem != null) : [];
        this.minPrice = res.data.minPrice || 0;
        this.maxPrice = res.data.maxPrice || 0;
        this.priceRange = [res.data.minPrice, res.data.maxPrice];
      }, (err) => {
        console.log(error);
        this.checkError(err.response);
      })
    },
    methods: {
      showList(mode) {
        if (mode === 'show') {
    	  this.pagination.page = 1;
    	  this.pagination.total = 0;
    	  this.pagination.totalPages = 0;
          this.loadList();
        } else {
          this.filters =  {
            sort: '-maxPrice',
            brand: [],
            age: [],
            flavor: [],
            size: []
          };
          this.pagination = {
            page: 1,
            total: 0,
            limit: '12',
            totalPages: 0
          }
          this.priceRange = [this.minPrice, this.maxPrice];
          this.loadList();
        }
        this.mobileFilterOpen = false;
      },
      loadList() {
        this.loading = true;
        let filtersStr = '';
        if (this.filters.brand.length > 0) {
          filtersStr += '&producer=' + this.filters.brand.join(',')
        }
        if (this.filters.age.length > 0) {
          let ages = [];
          for (const fl of this.filters.age){
            ages.push(this.ages.filter(elem => elem.name === fl)[0].value)
          }
          filtersStr += '&age=' + ages.join(',')
        }
        if (this.filters.flavor.length > 0) {
          let flavors = [];
          for (const fl of this.filters.flavor){
            flavors.push(this.flavors.filter(elem => elem.name === fl)[0].value)
          }
          filtersStr += '&flavor=' + flavors.join(',')
        }
        if (this.filters.size.length > 0) {
			let sizes = [];
			for (const fl of this.filters.flavor){
				sizes.push(this.sizes.filter(elem => elem.name === fl)[0].value)
			}
			filtersStr += '&size=' + sizes.join(',')
        }
        this.list = [];
        this.$axios.get(`${environment.api}/catalog/${this.$route.params.category}/${this.$route.params.subCategory}` +
          `?page=${this.pagination.page}&limit=${this.pagination.limit}&sort=${this.filters.sort}${filtersStr}` +
          `&minPrice=${this.priceRange[0]}&maxPrice=${this.priceRange[1]}`).then( res => {
          this.list = res.data.results;
          this.pagination.count = res.data.count;
          this.pagination.totalPages = res.data.total_pages;
          this.loading = false;
        }, (err) => {
          this.checkError(err.response);
        })
      },
      checkError(error) {
        if (error.status === 401 || error.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          this.$store.commit('setLoginState', false);
          this.$store.commit('setIsAdmin', false);
          this.$store.commit('setUser', null);
        }
      }
    }
  }
</script>

<style scoped>
  @import "~/assets/default.scss";
  .fade-enter-active, .fade-leave-active {
    transition: .4s;
    opacity: 1;
  }
  .fade-enter, .fade-leave-to{
    opacity: 0;
    transition: .4s;
  }
  .item-title{
    font-size: 1.1rem;
    line-height: 1.4rem;
  }
  .filters{
    width: 250px;
  }
  .list{
    width: calc(100% - 250px);
  }
  .list-head{
    height: 50px;
  }
  .price-fields{
    position: relative;
    top: -25px;
    margin-bottom: -25px;
  }
  .img-container{
    height: 220px;
    padding: 10px;
  }
  .mobile-list-filters{
    border-radius: 10px;
    box-shadow: 0 0 10px 2px lightgray;
  }
</style>
