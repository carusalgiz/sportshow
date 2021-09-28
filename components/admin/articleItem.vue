<template>
  <v-card class="d-flex align-center pl-2 pr-2 pt-1 pb-1 justify-space-between mb-2">
    <div>{{article.title}}</div>
    <div class="d-flex">
      <v-dialog v-model="articleOpen" persistent max-width="800">
        <template v-slot:activator="{on, attrs}">
          <v-btn icon outlined rounded color="primary" @click="openEdit">
            <v-icon>mdi-file-edit-outline</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="headline">Редактирование статьи</v-card-title>
          <v-card-text>
            <v-text-field class="mb-4" hide-details label="Название статьи" v-model="articleForm.title"></v-text-field>
            <v-radio-group v-model="articleForm.type">
              <v-radio
                v-for="type of articleClass.getTypes"
                :key="type.value"
                :label="type.name"
                :value="type.value"
              ></v-radio>
            </v-radio-group>
            <v-text-field v-if="articleForm.type === 'NEWS'"
                          label="Ссылка"
                          v-model="articleForm.link"></v-text-field>
            <tiptap-vuetify v-model="articleForm.text" :extensions="extensions"/>
            <div class="image-container mt-3">
              <v-img
                max-height="250"
                contain
                :src="articleForm.picture"
              ></v-img>
            </div>
            <v-file-input
              label="Фотография новости"
              v-if="articleForm.picture == null"
              v-model="picture"
              truncate-length="15"
              hide-details
              class="mb-4 flex-grow-0"
              @change="pictureChange"
            ></v-file-input>
            <v-btn v-if="articleForm.picture != null" @click="clearPhoto">Удалить фото</v-btn>
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
      <v-btn icon outlined rounded color="error" class="ml-2" @click="removeArticle">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>
  </v-card>
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
  } from 'tiptap-vuetify';
import Article from "~/class/article";
import {environment} from "assets/environment";

export default {
  props: ['article'],
  name: "articleItem",
  components: {TiptapVuetify},
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
      articleOpen: false,
      articleClass: Article,
      picture: null,
      articleForm: new Article()
    }
  },
  methods: {
    pictureChange() {
      this.articleForm.picture = this.picture != null ? URL.createObjectURL(this.picture) : '';
    },
    clearPhoto() {
      this.articleForm.picture = null;
      this.picture = null;
    },
    saveArticle() {
      const formData = new FormData();
      formData.append("picture", this.picture != null ?
        this.picture :
        this.articleForm.picture != null ? this.articleForm.picture.replace(environment.api, '') : null);
      formData.append("text", this.articleClass.transformHTML(this.articleForm.text));
      formData.append("title", this.articleForm.title);
      formData.append("type", this.articleForm.type);

      if (this.articleForm.type === 'NEWS') {
        formData.append("link", this.articleForm.link);
      }

      this.$axios.put(`${environment.api}/admin/posts/${this.article.id}`, formData,
        {headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }}
      ).then( (res) => {
        this.articleOpen = false;
        this.$emit('updateItem', res.data);
      }, (err) => {
        this.checkError(err.response);
      })
    },
    removeArticle() {
      this.$axios.delete(`${environment.api}/admin/posts/${this.article.id}`,
        {headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }}
      ).then( res => {
        this.$emit('updateList');
      }, (err) => {
        this.checkError(err.response);
      })
    },
    openEdit() {
      this.articleForm = {...this.article};
      this.articleForm.picture = this.articleForm.picture != null ? environment.api + this.articleForm.picture : null;
      this.picture = null;
      this.articleOpen = true;
    }
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>
