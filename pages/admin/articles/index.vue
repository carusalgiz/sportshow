<template>
  <div>
    <div class="d-flex justify-space-between mb-3">
      <h3>Статьи</h3>
      <v-dialog v-model="articleOpen" persistent max-width="800">
        <template v-slot:activator="{on, attrs}">
          <v-btn color="primary" v-bind="attrs" v-on="on">
            Добавить статью
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="headline">
            {{mode === 'add' ? 'Добавление статьи' : 'Редактирование статьи'}}
          </v-card-title>
          <v-card-text>
            <v-text-field class="mb-4" hide-details label="Название статьи" v-model="article.title"></v-text-field>
            <v-radio-group v-model="article.type">
              <v-radio
                v-for="type of articleClass.getTypes"
                :key="type.value"
                :label="type.name"
                :value="type.value"
              ></v-radio>
            </v-radio-group>
            <tiptap-vuetify v-model="article.text" :extensions="extensions"/>
            <div class="image-container mt-3">
              <v-img
                max-height="250"
                contain
                :src="article.picture"
              ></v-img>
            </div>
            <v-file-input
              label="Фотография новости"
              v-if="article.picture == null"
              v-model="picture"
              truncate-length="15"
              hide-details
              class="mb-4 flex-grow-0"
              @change="pictureChange"
            ></v-file-input>
            <v-btn v-if="article.picture != null" @click="clearPhoto">Удалить фото</v-btn>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="purple darken-1" outlined text @click="saveArticle">
              Сохранить
            </v-btn>
            <v-btn
              color="green darken-1"
              text
              outlined
              @click="articleOpen = false"
            >
              Закрыть
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div>
      <article-item
        v-for="(item, index) of articleList"
        :key="'post'+index"
        :article="item"
        v-on:updateList="getArticles"
        v-on:updateItem="updateItem( index, $event)"
      ></article-item>
      <div class="text-center">
        <v-pagination
          v-model="pagination.page"
          :length="pagination.totalPages"
          @input="getArticles"
        ></v-pagination>
      </div>
    </div>
  </div>

</template>

<script>
  import {
    TiptapVuetify,
    Heading,
    Bold,
    Italic,
    Strike,
    Underline,
    Code,
    Paragraph,
    BulletList,
    OrderedList,
    ListItem,
    Link,
    Blockquote,
    HardBreak,
    HorizontalRule,
    History
  } from 'tiptap-vuetify'
  import Article from "../../../class/article";
  import {environment} from "assets/environment";
  import ArticleItem from "../../../components/admin/articleItem";

  export default {
    components: { TiptapVuetify, ArticleItem },
    layout: 'admin',
    name: "index",
    data() {
      return {
        extensions: [
          History,
          Blockquote,
          Link,
          Underline,
          Strike,
          Italic,
          ListItem,
          BulletList,
          OrderedList,
          [
            Heading,
            {
              options: {
                levels: [1, 2, 3]
              }
            }
          ],
          Bold,
          Link,
          Code,
          HorizontalRule,
          Paragraph,
          HardBreak
        ],
        article: new Article(),
        articleClass: Article,
        articleOpen: false,
        mode: 'add',
        articleList: [],
        listLoading: false,
        picture: null,
        pagination: {
          page: 1,
          count: 0,
          limit: '15',
          totalPages: 0
        },
      }
    },
    methods: {
      clearPhoto() {
        this.article.picture = null;
        this.picture = null;
      },
      saveArticle() {
        const formData = new FormData();
        formData.append("picture", this.picture != null ? this.picture : this.article.picture);
        formData.append("text", this.articleClass.transformHTML(this.article.text));
        formData.append("title", this.article.title);
        formData.append("type", this.article.type);

        this.$axios.post(`${environment.api}/admin/posts`, formData,
          {headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }}
        ).then( res => {
          this.resetForm();
          this.getArticles();
          this.articleOpen = false;
        }, (err) => {
          this.checkError(err.response);
        })
      },
      resetForm() {
        this.article = new Article();
      },
      updateItem(index, item) {
        this.articleList = this.articleList.map(elem => {
          if (elem.id === item.id) { return item } else { return elem }
        });
      },
      pictureChange() {
        this.article.picture = this.picture != null ? URL.createObjectURL(this.picture) : '';
      },
      getArticles() {
        this.listLoading = true;
        this.$axios.get(`${environment.api}/admin/posts?page=${this.pagination.page}&limit=${this.pagination.limit}`, {headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }}).then( (result) => {
          this.articleList = result.data.results;
          this.pagination.count = result.data.count;
          this.pagination.totalPages = result.data.total_pages;
        }, (err) => {
          this.checkError(err.response);
          this.listLoading = false;
        });
      },
      checkError(error) {
        if (error.status === 401 || error.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          this.$store.commit('setLoginState', false);
          this.$store.commit('setIsAdmin', false);
          this.$store.commit('setUser', null);
          this.$router.push('/');
        }
      }
    },
    mounted() {
      this.article = new Article();
      this.getArticles();
    }
  }
</script>

<style scoped lang="scss">

</style>
