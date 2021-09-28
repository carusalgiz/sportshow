<template>
  <div class="d-flex flex-column justify-center">
    <div class="page-header">
      <v-container class="d-flex justify-space-between align-center">
        <h1>Новости и Статьи</h1>
      </v-container>
    </div>

    <div class="page-main">
      <v-container>
        <h4 class="w-100 d-flex justify-content" v-if="message">{{message}}</h4>
        <v-card>
          <v-card-title>
            <div class="d-flex flex-column w-100">
              <div class="d-flex justify-end w-100">
                <span style="font-size: 13px" class="text--secondary">Дата создания: {{article ? transformDate(article.created_date) : ''}}</span>
              </div>
              <h4 class="pink--text text--lighten-1">{{article ? article.title : ''}}</h4>
            </div>
          </v-card-title>
          <v-card-text>
            <v-img class="mb-5" :max-height="400" contain :src="article ? apiUrl + article.picture : ''"></v-img>
            <div v-html="article ? article.text : ''"></div>
          </v-card-text>
        </v-card>
      </v-container>
    </div>
  </div>
</template>

<script>
import Article from "@/class/article";
import {environment} from "assets/environment";

export default {
  name: "Article",
  data() {
    return {
      article: Article,
      message: '',
      apiUrl: environment.api
    }
  },
  methods: {
    transformDate(date) {
      return this.$moment(date).format('DD.MM.YYYY hh:mm')
    },
    getArticle() {
      this.listLoading = true;
      this.$axios.get(`${environment.api}/post/${this.$route.params.slug}`).then( (result) => {
        this.article = result.data;
      }, (err) => {
        this.message = '';
        for (const errorKey in err.response.data) {
          if (err.response.data.hasOwnProperty(errorKey)) {
            for (const errorValue of err.response.data[errorKey]) {
              this.message = '';
            }
          }
        }
      });
    },
  },
  mounted() {
    this.getArticle();
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
.post-img{
  float: left;
  margin-bottom: 30px;
  margin-right: 30px;
  max-width: 50%;
  max-height: 400px;
  background-size: contain;
  background-repeat: no-repeat;
  width: fit-content;
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
