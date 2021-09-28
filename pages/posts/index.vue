<template>
  <div class="d-flex flex-column justify-center">
    <div class="page-header">
      <v-container class="d-flex justify-space-between align-center">
        <h1>Новости и Статьи</h1>
      </v-container>
    </div>
    <div class="page-main">
      <v-container>
        <v-card v-for="(post, index) of articleList" :key="index" class="mb-3">
          <v-card-text>
            <div class="d-flex">
              <v-img class="mr-5" :max-height="100" :max-width="100" contain :src="apiUrl + post.picture"></v-img>
              <div class="d-flex flex-column w-100">
                <div class="d-flex justify-space-between w-100">
                  <h3 class="pink--text text--lighten-1 mb-2">{{post.title}}</h3>
                  <span style="font-size: 13px" class="text--secondary">Дата создания: {{transformDate(post.created_date)}}</span>
                </div>
                <div v-html="post.text.length > 350 ? post.text.substr(0, 350) + '...' : post.text"></div>
              </div>
            </div>
            <div class="w-100 d-flex justify-end">
              <NuxtLink :to="'posts/' + post.slug" style="text-decoration: none"><v-btn text color="primary">Подробнее</v-btn></NuxtLink>
            </div>
          </v-card-text>
        </v-card>
        <div class="text-center">
          <v-pagination
            v-model="pagination.page"
            :length="pagination.totalPages"
            @input="getArticles"
          ></v-pagination>
        </div>
      </v-container>
    </div>
  </div>
</template>

<script>
import {environment} from "assets/environment";
import Article from "~/class/article";

export default {
  name: "index",
  auth: false,
  data() {
    return {
      pagination: {
        page: 1,
        count: 0,
        limit: '5',
        totalPages: 0
      },
      articleList: [],
      listLoading: false,
      apiUrl: environment.api
    }
  },
  methods: {
    transformDate(date) {
      return this.$moment(date).format('DD.MM.YYYY hh:mm')
    },
    getArticles() {
      this.listLoading = true;
      this.$axios.get(`${environment.api}/post?page=${this.pagination.page}&limit=${this.pagination.limit}`).then( (result) => {
        this.articleList = result.data.results;
        this.pagination.count = result.data.count;
        this.pagination.totalPages = result.data.total_pages;
      }, (err) => {
        this.listLoading = false;
      });
    },
  },
  mounted() {
    this.getArticles();
  }
}
</script>


<style scoped lang="scss">
@import "~/assets/default.scss";
.page-header{
  h1{
    font-family: 'Montserrat Light', sans-serif;
  }
}
form{
  max-width: 50%;
}
.question{
  span:nth-child(1){
    font-family: 'Montserrat Light', sans-serif;
    font-size: 3rem;
    line-height: 3rem;
  }
  span:nth-child(2) {
    font-family: 'Montserrat Bold', sans-serif;
    font-size: 3rem;
  }
}
.w-100{
  h6{
    font-size: 1.1rem;
    letter-spacing: 0.03rem;
    line-height: 2.2rem;
    span{
      margin-left: 10px;
    }
  }
}
.fade-enter-active, .fade-leave-active {
  transition: .4s;
  opacity: 1;
  transform: translateY(0);
}
.fade-enter, .fade-leave-to{
  opacity: 0;
  transition: .4s;
  transform: translateY(-50px);
}
@media (max-width: 960px) {
  form {
    max-width: unset;
  }
  .question{
    span:nth-child(1){
      font-size: 1.8rem;
      line-height: 2.1rem;
    }
    span:nth-child(2) {
      font-size: 2.2rem;
      line-height: 2.4rem;
    }
  }
}
</style>

