<template>
  <div>
    <div class="d-flex">
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
        <v-text-field
            class="ml-4"
            style="min-width: 30vw"
          label="Поиск по названию товара"
          type="text"
          v-model="searchInput"
          @keyup.enter="pagination.page = 1; loadItems()"
        ></v-text-field>
      </div>
    </div>
    <v-btn color="primary" class="mb-3" @click="openCategoryForm({data: null, mode: 0})">
      <v-icon>mdi-plus</v-icon>
      <span>Добавить товар</span>
    </v-btn>
    <v-dialog
      v-model="createNewDialog"
      width="700"
      persistent
    >
      <v-card>
        <v-card-title class="headline grey lighten-2">
          {{dialogData.title}}
        </v-card-title>
        <v-card-text>
          <v-form v-model="createItemValid" class="mt-4">
            <v-row>
              <v-col cols="6" class="pt-0 pb-0">
                <v-select
                  :items="categories"
                  v-model="newItemForm.section"
                  item-text="name"
                  item-value="link"
                  label="Категория"
                  return-object
                  class="mr-3"
                >
                </v-select>
              </v-col>
              <v-col cols="6" class="pt-0 pb-0">
                <v-select
                  :items="newItemForm.section.subs"
                  v-model="newItemForm.subsection"
                  item-text="name"
                  item-value="link"
                  label="Подкатегория"
                  return-object
                  :disabled="newItemForm.section.subs.length === 0"
                >
                </v-select>
              </v-col>
              <v-col cols="6" class="pt-0 pb-0">
                <v-text-field
                  label="Артикул"
                  required filled
                  type="number"
                  v-model="newItemForm.code"
                ></v-text-field>
              </v-col>
              <v-col cols="6" class="pt-0 pb-0">
                <v-text-field
                  label="Производитель"
                  required filled
                  type="text"
                  v-model="newItemForm.producer"
                ></v-text-field>
              </v-col>
              <v-col cols="6" class="pt-0 pb-0">
                <v-select
                  :items="ages"
                  v-model="newItemForm.age"
                  item-text="name"
                  item-value="value"
                  label="Возраст животного"
                  v-if="newItemForm.section.link === 'korma' || newItemForm.section.link === 'vitaminy'"
                  return-object
                  solo
                ></v-select>
              </v-col>
              <v-col cols="6" class="pt-0 pb-0">
                <v-select
                  :items="flavors"
                  v-model="newItemForm.flavor"
                  item-text="name"
                  item-value="value"
                  label="Вкус корма"
                  return-object
                  v-if="newItemForm.section.link === 'korma'"
                  solo
                ></v-select>
              </v-col>
              <v-col cols="6" class="pt-0 pb-0">
                <v-select
                  :items="sizes"
                  v-model="newItemForm.size"
                  item-text="name"
                  item-value="value"
                  label="Размер животного"
                  return-object
                  solo
                ></v-select>
              </v-col>
              <v-col cols="12" class="pt-0 pb-0">
                <v-text-field
                  label="Название"
                  required filled
                  v-model="newItemForm.name"
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="pt-0 pb-0">
                <v-textarea
                  label="Описание"
                  required filled
                  v-model="newItemForm.description"
                ></v-textarea>
              </v-col>
            </v-row>
            <div class="d-flex align-center" style="height: 250px">
              <div class="image-container">
                <v-img
                  max-height="250"
                  contain
                  :src="newItemForm.picture"
                ></v-img>
              </div>
              <div class="d-flex flex-column justify-space-between h-100 w-100 ml-4">
                <v-text-field
                  label="Скидка на категорию"
                  required filled
                  type="number"
                  hide-details
                  class="mb-2 flex-grow-0"
                  v-model="newItemForm.discount"
                ></v-text-field>
                <v-file-input
                  v-if="newItemForm.picture == null"
                  label="Фотография товара"
                  v-model="picture"
                  truncate-length="15"
                  hide-details
                  class="mb-4 flex-grow-0"
                  @change="pictureChange"
                ></v-file-input>
                <v-btn v-if="newItemForm.picture != null" @click="clearPhoto">Удалить фото</v-btn>
              </div>
            </div>

          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="itemSend"
          >
            {{dialogData.button}}
          </v-btn>
          <v-btn
              color="green darken-1"
              text
              outlined
              @click="createNewDialog = false"
            >
              Закрыть
            </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

      <div
        v-for="(item,i) in items"
        class="mb-2"
      >
       <category-item :item="item" :key="i"
                      v-on:openCategoryForm="openCategoryForm"
                      v-on:deleteCategory="deleteCategory"
       ></category-item>

      </div>
    <div class="text-center">
      <v-pagination
        v-model="pagination.page"
        :length="pagination.totalPages"
        @input="loadItems"
      ></v-pagination>
    </div>
  </div>
</template>

<script>
    import {environment} from "../../../assets/environment";
    import {age, categories, flavor, sizes} from "../../../static/data";
    import CategoryItem from "../../../components/admin/categoryItem";

    export default {
      name: "index",
      components: {CategoryItem},
      layout: 'admin',
      data() {
        return {
          searchInput: '',
          createItemValid: false,
          categories: categories,
          currentCategory: {
            name: '',
            link: '',
            subs: []
          },
          currentSubCategory: null,
          items: [],
          createNewDialog: false, // окно новой категории
          newItemForm: {
            age: null,
            flavor: null,
            producer: null,
            size: null,
            name: '',
            description: '',
            code: 0,
            discount: 0,
            picture: null,
            section: categories[0],
            subsection: categories[0].subs[0]
          },
          dialogData: {
            title: 'Добавление нового товара',
            button: 'Создать'
          },
          picture: null,
          ages: age,
          flavors: flavor,
          sizes: sizes,
          formMode: 0, // 0 - create, 1 - edit,
          pagination: {
            page: 1,
            count: 0,
            limit: '10',
            totalPages: 0
          },
        }
      },
      mounted() {
        this.currentCategory = this.categories[0];
        this.newItemForm.section = this.categories[0];
        this.newItemForm.subsection = this.categories[0].subs[0];
        this.setSubCategory();
      },
      methods: {
        clearPhoto() {
          this.newItemForm.picture = null;
          this.picture = null;
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
        },
        resetItemForm() {
          this.newItemForm = {
            age: null,
            flavor: null,
            producer: null,
            size: null,
            name: '',
            description: '',
            code: 0,
            discount: 0,
            picture: null,
            section: this.categories[0],
            subsection: this.categories[0].subs[0]
          };
          this.picture = null;
        },
        setSubCategory() {
          if (this.currentCategory.subs.length !== 0) {
            this.currentSubCategory = this.currentCategory.subs[0];
          }
          this.loadItems();
        },
        loadItems() {
          this.$axios.get(`${environment.api}/admin/categories?section=${this.currentCategory.link}&subsection=${this.currentSubCategory.link}&page=${this.pagination.page}&limit=${this.pagination.limit}&q=${this.searchInput}`,
            {headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
              }}).then( result => {
            this.items = result.data.results;
            this.pagination.count = result.data.count;
            this.pagination.totalPages = result.data.total_pages;
            }, (err) => {
              this.checkError(err.response);
          })
        },
        openCategoryForm(event) {
          console.log(event);
          this.formMode =  event.mode;
          if ( event.mode === 0) { // create
            this.resetItemForm();
            this.dialogData.title = 'Добавление нового товара';
            this.dialogData.button = 'Создать';
          } else { // edit
            this.newItemForm = {... event.data};
            this.newItemForm.section = this.categories.filter(elem => elem.link === this.newItemForm.section)[0];
            this.newItemForm.subsection = this.newItemForm.section.subs.filter(elem => elem.link === this.newItemForm.subsection)[0];
            this.newItemForm.picture = this.newItemForm.picture != null ? environment.api + this.newItemForm.picture : null;
            this.newItemForm.flavor = this.newItemForm.flavor != null ? this.flavors.filter(elem => elem.value === this.newItemForm.flavor)[0] : null;
            this.newItemForm.age = this.newItemForm.age != null ? this.ages.filter(elem => elem.value === this.newItemForm.age)[0] : null;
            this.newItemForm.size = this.newItemForm.size != null ? this.sizes.filter(elem => elem.value === this.newItemForm.size)[0] : null;
            this.dialogData.title = 'Редактирование товара';
            this.dialogData.button = 'Обновить';
            console.log(this.newItemForm);
          }
          this.createNewDialog = true;
        },
        pictureChange() {
          this.newItemForm.picture = this.picture != null ? URL.createObjectURL(this.picture) : '';
        },
        itemSend() {
          this.formMode === 0 ? this.createCategory() : this.updateCategory()
        },
        updateCategory() {
          console.log(this.newItemForm);
          const formData = new FormData();
          formData.append("picture", this.picture != null ?
            this.picture :
            this.newItemForm.picture != null ? this.newItemForm.picture.replace(environment.api, '') : null);
          // formData.append("picture", null);
          formData.append("name", this.newItemForm.name);
          formData.append("description", this.newItemForm.description);
          formData.append("code", this.newItemForm.code);
          formData.append("discount", this.newItemForm.discount);
          formData.append("section", this.newItemForm.section.link);
          formData.append("subsection", this.newItemForm.subsection.link);
          this.newItemForm.age != null ? formData.append("age", this.newItemForm.age.value) : false;
          this.newItemForm.flavor != null ? formData.append("flavor", this.newItemForm.flavor.value) : false;
          this.newItemForm.size != null ? formData.append("size", this.newItemForm.size.value) : false;
          formData.append("producer", this.newItemForm.producer);
          console.log(this.newItemForm.subsection.link);
          this.$axios.put(`${environment.api}/admin/categories/${this.newItemForm.id}`, formData,
            {headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
              }}
          ).then( res => {
            this.resetItemForm();
            this.loadItems();
            this.createNewDialog = false;
          }, (err) => {
            this.checkError(err.response);
          })
        },
        createCategory() {
          const formData = new FormData();
          formData.append("picture", this.picture != null ? this.picture : this.newItemForm.picture);
          formData.append("name", this.newItemForm.name);
          formData.append("description", this.newItemForm.description);
          formData.append("code", this.newItemForm.code);
          formData.append("discount", this.newItemForm.discount);
          formData.append("section", this.newItemForm.section.link);
          formData.append("subsection", this.newItemForm.subsection.link);
          this.newItemForm.age != null ? formData.append("age", this.newItemForm.age.value) : false;
          this.newItemForm.flavor != null ? formData.append("flavor", this.newItemForm.flavor.value) : false;
          this.newItemForm.size != null ? formData.append("size", this.newItemForm.size.value) : false;
          formData.append("producer", this.newItemForm.producer);
          this.$axios.post(`${environment.api}/admin/categories`, formData,
                {headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                  }}
          ).then( res => {
            this.resetItemForm();
            this.loadItems();
            this.createNewDialog = false;
          }, (err) => {
            this.checkError(err.response);
          })
        },
        deleteCategory(id) {
          this.$axios.delete(`${environment.api}/admin/categories/${id}`,
            {headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
              }}
          ).then( res => {
            this.loadItems();
          }, (err) => {
            this.checkError(err.response);
          })
        }
      }
    }
</script>

<style scoped>
  @import "~/assets/default.scss";
  .image-container{
    min-width: 250px;
    width: 250px;
    height: 250px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: lightgray;
  }
  .sub-items-list{
    border-radius: 5px;
    border: 1px solid lightgray;
    height: 10px;
  }
</style>
