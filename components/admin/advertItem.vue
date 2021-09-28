<template>
  <v-card class="d-flex align-start pl-2 pr-2 pt-1 pb-1 justify-space-between mb-2">
    <div class="d-flex flex-column">
      <div style="margin-bottom: 40px">Время показа рекламы с <b>{{advert.date_start ? transformDate(advert.date_start) : '"Не указано"'}}</b> до
        <b>{{advert.date_end ? transformDate(advert.date_end) : '"Не указано"'}}</b></div>
      <div v-html="advert.text"></div>
    </div>

    <div class="d-flex">
      <v-dialog v-model="advertOpen" persistent max-width="800">
        <template v-slot:activator="{on, attrs}">
          <v-btn icon outlined rounded color="primary" @click="openEdit">
            <v-icon>mdi-file-edit-outline</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="headline">Редактирование рекламного блока</v-card-title>
          <v-card-text>
            <v-text-field  label="Ссылка"
                          v-model="advertForm.link"></v-text-field>
            <div class="d-flex justify-space-between mb-3">
              <div class="d-flex flex-column mr-4">
                <label for="date-start">Дата начала показа</label>
                <input id="date-start" type="datetime-local" v-model="advertForm.date_start">
              </div>
              <div class="d-flex flex-column">
                <label for="date-end">Дата окончания показа</label>
                <input id="date-end" type="datetime-local" v-model="advertForm.date_end">
              </div>
              <v-switch
                v-model="advertForm.active"
                :label="`Активно: ${advertForm.active ? 'Да' : 'Нет'}`"
              ></v-switch>
            </div>
            <tiptap-vuetify v-model="advertForm.text" :extensions="extensions"/>
            <div class="image-container mt-3">
              <v-img
                max-height="250"
                contain
                :src="advertForm.picture"
              ></v-img>
            </div>
            <v-file-input
              label="Фотография рекламы"
              v-if="advertForm.picture == null"
              v-model="picture"
              truncate-length="15"
              hide-details
              class="mb-4 flex-grow-0"
              @change="pictureChange"
            ></v-file-input>
            <v-btn class="mt-3" v-if="advertForm.picture != null" @click="clearPhoto">Удалить фото</v-btn>
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
      <v-btn icon outlined rounded color="error" class="ml-2" @click="removeadvert">
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
import {environment} from "assets/environment";
import Advert from "~/class/advert";
import Index from "~/pages";

export default {
  props: ['advert'],
  name: "advertItem",
  components: {Index, TiptapVuetify},
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
      advertOpen: false,
      picture: null,
      advertForm: new Advert(),
      advertClass: Advert
    }
  },
  methods: {
    transformDate(date) {
      return this.$moment(date).format('DD.MM.YYYY hh:mm:ss')
    },
    pictureChange() {
      this.advertForm.picture = this.picture != null ? URL.createObjectURL(this.picture) : '';
    },
    clearPhoto() {
      this.advertForm.picture = null;
      this.picture = null;
    },
    saveadvert() {
      const formData = new FormData();
      formData.append("picture", this.picture != null ?
        this.picture :
        this.advertForm.picture != null ? this.advertForm.picture.replace(environment.api, '') : null);
       if (this.advertForm.text != null) {
        formData.append("text", this.advertClass.transformHTML(this.advertForm.text));
      }
      if (this.advertForm.link != null) {
        formData.append("link", this.advertForm.link);
      }
      formData.append("active", this.advertForm.active);
      if (this.advertForm.date_start) {
        this.advertForm.date_start = this.advertForm.date_start.split(':00Z')[0];
        formData.append("date_start", this.advertForm.date_start);
      }
      if (this.advertForm.date_end) {
        this.advertForm.date_end = this.advertForm.date_end.split(':00Z')[0];
        formData.append("date_end", this.advertForm.date_end);
      }

      this.$axios.put(`${environment.api}/admin/advertising/${this.advert.id}`, formData,
        {headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }}
      ).then( (res) => {
        this.advertOpen = false;
        this.$emit('updateItem', res.data);
      }, (err) => {
        this.checkError(err.response);
      })
    },
    removeadvert() {
      this.$axios.delete(`${environment.api}/admin/advertising/${this.advert.id}`,
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
      this.advertForm = {...this.advert};
      if (this.advertForm.date_start) {
        this.advertForm.date_start = this.advertForm.date_start.split(':00Z')[0];
      }
      if (this.advertForm.date_end) {
        this.advertForm.date_end = this.advertForm.date_end.split(':00Z')[0];
      }
      this.advertForm.picture = this.advertForm.picture != null ? environment.api + this.advertForm.picture : null;
      this.picture = null;
      this.advertOpen = true;
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
  }
}
</script>

<style scoped lang="scss">
</style>
