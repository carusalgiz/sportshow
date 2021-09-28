<template>
  <div>
    <v-card class="d-flex justify-space-between align-center head" v-bind:class="subsOpen && subs.length > 0 ? 'active' : ''">
      <div class="flex-grow-1 h-100 pt-3 pb-3 pl-4 pr-4 d-flex head-item" @click="loadSubs()">
        <div class="code-col">
          {{item.code}}
        </div>
        <div class="name-col">
          {{item.name}}
        </div>
      </div>
      <div class="d-flex">
        <v-btn outlined icon class="mr-2" color="success" @click="openSubForm(item, 0)">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-btn outlined icon class="mr-2" color="info" @click="openCategoryForm()">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn outlined icon class="mr-3" color="error" @click="deleteCategory()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
    </v-card>
    <div class="d-flex w-100 justify-center mb-3 pa-3"
         style="height: 50px"
         v-if="loading || (!loading && subs.length === 0 && subsOpen)">
      <v-progress-circular v-if="loading"
        :width="3"
        color="red"
        indeterminate
      ></v-progress-circular>
      <h4 class="light-blue--text text--darken-4" v-if="!loading && subs.length === 0">Товары не найдены</h4>
    </div>
    <v-divider v-if="subs.length > 0 && subsOpen"></v-divider>
    <transition name="fade">
      <div class="subs-list" v-if="subs.length > 0 && subsOpen">

            <v-row class="w-100 mr-0 ml-0 grey lighten-2 subs-head" >
              <v-col cols="2">Артикул</v-col>
              <v-col cols="2">Опция</v-col>
              <v-col cols="2">Количество</v-col>
              <v-col cols="2">Цена</v-col>
              <v-col cols="2">Скидка</v-col>
            </v-row>
            <template v-for="(sub, index) of subs">
              <v-row :key="index" class="sub-item pl-2 pr-2 pt-1 pb-1 mb-0 d-flex w-100 mr-0 ml-0">
                <v-col class="pt-0 pb-0 d-flex align-center" cols="2">
                  {{sub.code}}
                </v-col>
                <v-col class="pt-0 pb-0 d-flex align-center" cols="2">
                  {{sub.option}}
                </v-col>
                <v-col class="pt-0 pb-0 d-flex align-center" cols="2">
                  {{sub.count}}
                </v-col>
                <v-col class="pt-0 pb-0 d-flex align-center" cols="2">
                  {{sub.price}}
                </v-col>
                <v-col class="pt-0 pb-0 d-flex align-center" cols="2">
                  {{sub.discount}}
                </v-col>
                <v-col cols="2" class="pt-0 pb-0 d-flex align-center d-flex justify-end">
                  <v-btn outlined icon class="mr-2" color="info" @click="openSubForm(sub, 1)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn outlined icon class="mr-3" color="error" @click="deleteOption(sub)">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-divider v-if="index !== subs.length - 1"></v-divider>
            </template>


      </div>
    </transition>
    <v-dialog
      v-model="subItemDialog"
      persistent
      width="600">
      <v-card>
        <v-card-title class="headline grey lighten-2">
          {{dialogData.title}}
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field
              class="mt-4"
              label="Артикул"
              required filled
              type="number"
              v-model="subItemForm.code"
            ></v-text-field>
            <v-text-field
              label="Опция"
              required filled
              type="text"
              v-model="subItemForm.option"
            ></v-text-field>
            <v-text-field
              label="Количество товара в наличии"
              required filled
              type="number"
              v-model="subItemForm.count"
            ></v-text-field>
            <v-text-field
              label="Цена товара"
              required filled
              type="number"
              v-model="subItemForm.price"
            ></v-text-field>
            <v-text-field
              label="Скидка на товар"
              required filled
              type="number"
              v-model="subItemForm.discount"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="subItemSend"
          >
            {{dialogData.button}}
          </v-btn>
          <v-btn
              color="green darken-1"
              text
              outlined
              @click="subItemDialog = false"
            >
              Закрыть
            </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
    import {environment} from "../../assets/environment";

    export default {
      props: ['item'],
      name: "categoryItem",
      data() {
        return {
          subs: [],
          subsOpen: false,
          loading: false,
          subItemForm: {
            code: 0,
            category_id: 0,
            option: '',
            price: 0,
            count:0,
            discount: 0
          },
          dialogData: {
            title: 'Добавление нового товара',
            button: 'Создать'
          },
          subItemDialog: false, // окно товара в категории
          formSubItemMode: 0 // 0 - create, 1 - edit,
        }
      },
      methods: {
        resetSubItemForm() {
          this.subItemForm = {
            code: null,
            category_id: null,
            option: '',
            price: 0,
            discount: 0,
            count: 0
          };
        },
        subsLoading() {
          this.subs = [];
          this.loading = true;
          this.$axios.get(`${environment.api}/admin/pricelist?category=${this.item.id}`,
            {headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
              }}
          ).then( res => {
            this.subs = res.data;
            this.loading = false;
          }, (err) => {
            this.checkError(err.response);
            this.loading = false;
          })
        },
        loadSubs() {
          this.subsOpen = !this.subsOpen;
          if (this.subsOpen) {
            this.subsLoading();
          }
        },
        openSubForm(item, mode) {
          this.formSubItemMode =  mode;
          if ( mode === 0) {
            this.subItemForm = {
              code: null,
              category_id:  item.id,
              option: '',
              price: 0,
              discount: 0,
              count: 0
            };
            this.dialogData.title = 'Добавление нового товара';
            this.dialogData.button = 'Создать';
          } else {
            this.subItemForm = {...item};
            this.dialogData.title = 'Редактирование товара';
            this.dialogData.button = 'Обновить';
          }
          this.subItemDialog = true;
        },
        subItemSend() {
          if (this.formSubItemMode === 0) {
            this.$axios.post(`${environment.api}/admin/pricelist`, this.subItemForm,
              {headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('token')
                }}
            ).then( res => {
              this.resetSubItemForm();
              this.subItemDialog = false;
              this.subsLoading();
            }, (err) => {
              this.checkError(err.response);
            })
          } else { //edit
            this.$axios.put(`${environment.api}/admin/pricelist/${this.subItemForm.id}`, this.subItemForm,
              {headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('token')
                }}
            ).then( res => {
              this.resetSubItemForm();
              this.subItemDialog = false;
              this.subsLoading();
            }, (err) => {
              this.checkError(err.response);
            })
          }
        },
        openCategoryForm() {
          this.$emit('openCategoryForm', {data: this.item, mode: 1})
        },
        deleteCategory() {
          this.$emit('deleteCategory', this.item.id)
        },
        deleteOption(sub) {
          console.log(sub);
          this.$axios.delete(`${environment.api}/admin/pricelist/${sub.id}`,
            {headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
              }}
          ).then( res => {
            this.subsLoading();
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
            this.$router.push('/admin');
          }
        }
      }
    }
</script>

<style scoped>
  @import "~/assets/default.scss";
  .head{
    transition: .2s;
  }
  .head.active{
    background: linear-gradient(to right, rgb(230 208 255), white);
  }
  .head-item:hover{
    cursor: pointer;
  }
  .subs-head{
    font-size: 1rem;
    font-weight: bold;
  }
  .sub-item{
    border-radius: 5px;
    background-color: white;
  }
  .code-col{
    flex: 0 0 10%;
    min-width: 100px;
  }
  .name-col{
    flex: 0 0 90%;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .3s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
    opacity: 0;
  }
</style>
