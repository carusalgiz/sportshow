<template>
  <div>
    <div class="d-flex justify-space-between mb-3">
      <h3>Реклама</h3>
      <v-dialog v-model="advertOpen" persistent max-width="800">
        <template v-slot:activator="{on, attrs}">
          <v-btn color="primary" v-bind="attrs" v-on="on">
            Добавить рекламный блок
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="headline">Добавление рекламного блока</v-card-title>
          <v-card-text>
            <v-text-field label="Ссылка"
                          v-model="advert.link"></v-text-field>
            <div class="d-flex mb-3">
              <div class="d-flex flex-column mr-4">
                <label for="date-start">Дата начала показа</label>
                <input id="date-start" type="datetime-local" v-model="advert.date_start">
              </div>
              <div class="d-flex flex-column">
                <label for="date-end">Дата окончания показа</label>
                <input id="date-end" type="datetime-local" v-model="advert.date_end">
              </div>
            </div>


            <tiptap-vuetify v-model="advert.text" :extensions="extensions"/>
            <div class="image-container mt-3">
              <v-img
                max-height="250"
                contain
                :src="advert.picture"
              ></v-img>
            </div>
            <v-file-input
              label="Фотография рекламы"
              v-if="advert.picture == null"
              v-model="picture"
              truncate-length="15"
              hide-details
              class="mb-4 flex-grow-0"
              @change="pictureChange"
            ></v-file-input>
            <v-btn class="mt-3" v-if="advert.picture != null" @click="clearPhoto">Удалить фото</v-btn>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="purple darken-1" outlined text @click="saveadvert">
              Сохранить
            </v-btn>
            <v-btn
              color="green darken-1"
              text
              outlined
              @click="advertOpen = false"
            >
              Закрыть
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div>
      <advert-item
        v-for="(item, index) of advertList"
        :key="'post'+index"
        :advert="item"
        v-on:updateList="getadverts"
        v-on:updateItem="updateItem( index, $event)"
      ></advert-item>
      <div class="text-center">
        <v-pagination
          v-model="pagination.page"
          :length="pagination.totalPages"
          @input="getadverts"
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
import {environment} from "assets/environment";
import advertItem from "../../../components/admin/advertItem";
import Advert from "~/class/advert";

export default {
  components: { TiptapVuetify, advertItem },
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
      advert: new Advert(),
      advertClass: Advert,
      advertOpen: false,
      mode: 'add',
      advertList: [],
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
      this.advert.picture = null;
      this.picture = null;
    },
    saveadvert() {
      const formData = new FormData();
      formData.append("picture", this.picture != null ? this.picture : this.advert.picture);
      if (this.advert.text != null) {
        formData.append("text", this.advertClass.transformHTML(this.advert.text));
      }
      if (this.advert.link != null) {
        formData.append("link", this.advert.link);
      }
      if (this.advert.date_start) {
        this.advert.date_start = this.advert.date_start.split(':00Z')[0];
        formData.append("date_start", this.advert.date_start);
      }
      if (this.advert.date_end) {
        this.advert.date_end = this.advert.date_end.split(':00Z')[0];
        formData.append("date_end", this.advert.date_end);
      }

      this.$axios.post(`${environment.api}/admin/advertising`, formData,
        {headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }}
      ).then( res => {
        this.resetForm();
        this.getadverts();
        this.advertOpen = false;
        this.advert = new Advert();
        this.picture = null;
      }, (err) => {
        if (err) {
          this.checkError(err.response);
        }
      })
    },
    resetForm() {
      this.advert = new Advert();
    },
    updateItem(index, item) {
      this.advertList = this.advertList.map(elem => {
        if (elem.id === item.id) { return item } else { return elem }
      });
    },
    pictureChange() {
      this.advert.picture = this.picture != null ? URL.createObjectURL(this.picture) : '';
    },
    getadverts() {
      this.listLoading = true;
      this.$axios.get(`${environment.api}/admin/advertising?page=${this.pagination.page}&limit=${this.pagination.limit}`, {headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }}).then( (result) => {
        this.advertList = result.data.results;
        this.pagination.count = result.data.count;
        this.pagination.totalPages = result.data.total_pages;
      }, (err) => {
        if (err) {
          this.checkError(err);
        }
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
    this.advert = new Advert();
    this.getadverts();
  }
}
</script>

<style scoped lang="scss">
</style>
