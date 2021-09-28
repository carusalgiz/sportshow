<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="users"
      :loading="loading"
      loading-text="Загрузка..."
      class="elevation-1"
      hide-default-footer
    >
      <template v-slot:item.is_staff="{ item }">
        {{item.is_staff ? 'Да' : 'Нет'}}
      </template>
      <template v-slot:item.last_login="{ item }">
        {{transformDate(item.last_login)}}
      </template>
      <template v-slot:item.buttons="{ item }">
        <div class="d-flex justify-end">
          <v-btn color="primary" class="mr-3" outlined icon @click="edit(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-dialog max-width="800"
                    persistent
                    v-model="editPerson">
            <v-card>
              <v-card-title class="grey lighten-2">
                Редактирование пользователя
              </v-card-title>
              <v-card-text class="pt-3">
                <v-form @submit.prevent="updateUser">
                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      label="Телефон"
                      :rules="usernameRules"
                      required
                      v-mask="'# (###) ### ##-##'"
                      filled
                      rounded
                      v-model="curPerson.username"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      label="Email"
                      :rules="emailRules"
                      required
                      filled
                      rounded
                      v-model="curPerson.email"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="5">
                    <v-text-field
                      label="Имя"
                      required
                      filled
                      rounded
                      v-model="curPerson.first_name"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="5">
                    <v-text-field
                      label="Имя"
                      required
                      filled
                      rounded
                      v-model="curPerson.last_name"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="2">
                    <v-switch label="Админ" v-model="curPerson.is_staff"></v-switch>
                  </v-col>
                  <v-col cols="12">
                    <div class="d-flex justify-end" >
                      <v-btn color="primary" type="submit">
                        Сохранить
                      </v-btn>
                      <v-btn
                          color="green darken-1"
                          text
                          outlined
                          @click="editPerson = false"
                        >
                          Закрыть
                        </v-btn>
                    </div>
                  </v-col>
                </v-row>
              </v-form>
              </v-card-text>
            </v-card>
          </v-dialog>
          <v-btn outlined icon class="mr-3" color="error" @click="deletePerson(item)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
      </template>
    </v-data-table>
    <div class="text-center">
      <v-pagination
        v-model="pagination.page"
        :length="pagination.totalPages"
        @input="loadList"
      ></v-pagination>
    </div>
  </div>

</template>

<script>
    import {environment} from "assets/environment";

    export default {
      layout: 'admin',
      name: 'index',
      data() {
        return {
          loading: false,
          headers: [
            { text: 'Email', value: 'email'},
            { text: 'Телефон', value: 'username' },
            { text: 'Имя', value: 'first_name' },
            { text: 'Фамилия', value: 'last_name' },
            { text: 'Админ', value: 'is_staff' },
            { text: 'Дата последнего входа', value: 'last_login' },
            { text: '', value: 'buttons' }
          ],
          users: [],
          editPerson: false,
          curPerson: {
            id: 0,
            email: '',
            username: '',
            first_name: '',
            last_name: '',
            is_staff: false,
            last_login: ''
          },
          usernameRules: [
            v => !!v || 'Заполните телефон'
          ],
          emailRules: [
            v => !!v || 'Заполните электронный адрес',
            v => /.+@.+/.test(v) || 'Проверьте правильность написания email',
          ],
          pagination: {
            page: 1,
            count: 0,
            limit: '15',
            totalPages: 0
          }
        }
      },
      mounted() {
        this.loadList();
      },
      methods: {
        deletePerson(person) {
          this.$axios.delete(`${environment.api}/admin/users/${person.id}`,
            {headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
              }}
          ).then( () => {
            this.loadList();
          }, (err) => {
            this.checkError(err.response);
          })
        },
        updateUser() {
          const person = {...this.curPerson};
          person.username = person.username.split('(').join('').split(')').join('').split(' ').join('').split('-').join('').trim()
          this.$axios.$put(`${environment.api}/admin/users/${this.curPerson.id}`, person, {headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }}).then( (result) => {
            this.loadList();
            this.editPerson = false;
            this.$store.commit('setUser', result);
          }, (err) => {
            this.checkError(err.response);
          });
        },
        edit(person) {
          this.curPerson = person;
          this.editPerson = true;
        },
        transformDate(date) {
          return this.$moment(date).format('DD.MM.YYYY hh:mm:ss')
        },
        loadList() {
          this.loading = true;
          this.$axios.get(`${environment.api}/admin/users?page=${this.pagination.page}&limit=${this.pagination.limit}`,
            {headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
              }}).then( result => {
            this.users = result.data.results;
            this.pagination.count = result.data.count;
            this.pagination.totalPages = result.data.total_pages;
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
            this.$router.push('/admin');
          }
        }
      }
    }
</script>

<style scoped>

</style>
