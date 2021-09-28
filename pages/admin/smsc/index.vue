<template>
  <div>
    <div class="d-flex justify-space-between mb-4">
      <div class="d-flex">
        <v-menu
          ref="menuStart"
          v-model="menuStart"
          :close-on-content-click="true"
          transition="scale-transition"
          offset-y
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="dateStart"
              label="История от.."
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
              class="mr-4"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="dateStart"
            :value="dateStart"
            no-title
            scrollable
            @change="getSmsList()"
          >
          </v-date-picker>
        </v-menu>
        <v-menu
          ref="menuEnd"
          v-model="menuEnd"
          :close-on-content-click="true"
          transition="scale-transition"
          offset-y
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="dateEnd"
              label="История до .."
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="dateEnd"
            :value="dateEnd"
            @change="getSmsList()"
            no-title
            scrollable
          >
          </v-date-picker>
        </v-menu>

        <v-text-field
          class="ml-4"
          v-model="phone"
          label="История по телефону"
          placeholder="89999999999"
          @keypress.enter="getSmsList"
        ></v-text-field>
      </div>

      <h2>Баланс: {{balance}}</h2>
    </div>
    <div>
      <v-alert
        border="top"
        color="red lighten-2"
        dark
        v-if="message"
      >
        {{message}}
      </v-alert>
      <v-simple-table dense fixed-header height="600">
        <template v-slot:default>
          <thead>
          <tr>
            <th class="text-left">
              Дата отправки
            </th>
            <th class="text-left">
              Сообщение
            </th>
            <th class="text-left">
              Телефон
            </th>
            <th class="text-left">
              Статус
            </th>
          </tr>
          </thead>
          <tbody>
          <tr
            v-for="item in smsList"
            :key="item.id"
          >
            <td>{{ item.send_date }}</td>
            <td>{{ item.message }}</td>
            <td>{{ item.phone }}</td>
            <td>{{ item.status_name }}</td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
    </div>
  </div>
</template>

<script>
    import moment from 'moment';
    import {environment} from "../../../assets/environment";

    export default {
      name: "index",
      layout: 'admin',
      data() {
        return {
          smsList: null,
          balance: 0,
          menuStart: false,
          dateStart: null,
          menuEnd: false,
          dateEnd: null,
          phone: '',
          message: ''
        }
      },
      mounted() {
        this.dateStart = this.$moment(new Date()).format('YYYY-MM-DD');
        this.dateEnd = this.$moment(new Date()).format('YYYY-MM-DD');
        this.getSmsList();
        this.getBalance();
      },
      methods: {
        info(event) {
          console.log(event);
        },
        getSmsList() {
          let params = '';
          if (this.dateStart) { params += `&start=${this.$moment(this.dateStart).format('DD.MM.YYYY')}`}
            else { params += `&start=${this.$moment(new Date()).format('DD.MM.YYYY')}`}
          if (this.dateEnd) { params += `&end=${this.$moment(this.dateEnd).format('DD.MM.YYYY')}}`}
            else { params += `&end=${this.$moment(new Date()).format('DD.MM.YYYY')}`}
          if (this.phone.trim().length > 0) {
            params += `&phone=${this.phone.replaceAll(' ', '')
            .replace('-', '')
            .replace('(', '')
            .replace(')', '')}`}
          this.$axios.get(`${environment.api}/admin/sms?type=history${params}`,
            {headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
              }}).then( (result) => {
            this.message = '';
            if (result.data.error) {
              if (result.data.error === 'message not found') {
                this.message = 'Сообщения не найдены';
              } else if (result.data.error === 'request limit exceeded, wait next hour') {
                this.message = 'Лимит запросов исчерпан, подождите пожалуйста 1 час';
              } else {
                this.message = result.data.error;
              }
            } else {
              this.smsList = result.data;
            }
          }, (err) => {
            this.message = err.response;
            this.checkError(err.response);
          });
        },
        getBalance() {
          this.$axios.get(`${environment.api}/admin/sms?type=balance`,
            {headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
              }}).then( (result) => {
            this.message = '';
            if (result.data.error) {
              this.message = result.data.error;
            }
            this.balance = result.data.balance;
          }, (err) => {
            this.message = err.response;
            this.checkError(err.response);
          });
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

</style>
