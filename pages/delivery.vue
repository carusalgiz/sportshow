<template>
  <div class="d-flex flex-column justify-center">
    <div class="page-header">
      <v-container class="d-flex justify-space-between align-center">
        <h1>Оплата и доставка</h1>
      </v-container>
    </div>
    <v-container class="page-main">
      <h2>Доставка</h2>
      <p>При доставке по Хабаровску, Тополево, Матвеевке, Березовке, Горькому, Федоровке, Виноградовке, Мирному, Восточному, Гаровке-1, Гаровке-2, Ракитному, Нагорному, Мичуринскому:</p>
      <ul>
        <li>Доставка заказов общей стоимостью 2000 руб. и более Бесплатно</li>
        <li>Доставка заказов общей стоимостью менее 2000 руб. 200 руб.</li>
      </ul>
      <p>
        При расчёте стоимости и условий доставки учитывается итоговая сумма заказа, после применения скидок по акциям, и прочим специальным (в том числе персональным) промо предложениям.
      </p>
      <p>Заказы оформленные до 12:00 доставляются в тот же день</p>
      <p>Заказы оформленные после 12:00 доставляются на следующий рабочий день</p>
      <p>Доставка осуществляется в будние дни</p>
      <p>Время доставки 2-х часовой интервал, который согласовывается с покупателем с 16-00 до 22-00</p>
      <p>Доставка в другие населенные пункты возможна транспортными компаниями, Почтой России или на выставки, в случае наличия такой возможности.</p>
      <h2 class="mt-5">Оплата</h2>
      <p>Оплатить покупку в магазине можно несколькими способами:</p>
      <ul>
        <li>
          <div class="d-flex flex-column">
            <span><b>Наличный расчёт</b></span>
            <span>Вы можете оплатить покупку наличными в магазине или курьеру (при доставке товара).</span>
          </div>
        </li>
        <li>
          <div class="d-flex flex-column">
            <span><b>Пластиковые карты</b></span>
            <span>Безналичная оплата банковской картой в магазине и при доставке. Принимаются карты следующих платёжных систем:
«VISA», «MasterCard», «Золотая Корона», «МИР».</span>
          </div>
        </li>
        <li>
          <div class="d-flex flex-column">
            <span><b>Онлайн-оплата на сайте</b></span>
            <span>Оплата осуществляется через компанию-партнера - ЮKassa. Комиссия не взимается. К оплате принимаются кошельки WebMoney,
              банковские карты, QIWI-кошельки и кошельки ЮMoney. </span>
            <br>
            <span>Если вы выбираете онлайн-оплату - вы указываете информацию о своем платежном средстве в специальной защищенной форме оплаты на странице компании-партнера. Партнер проводит проверку сформированного запроса на соответствие установленном требованиям и передает этот запрос на авторизацию. После того, как банк-эмитент подтвердил
              авторизацию платежа, вы возвращаетесь на наш сайт на страницу подтверждения заказа.</span>
            <br>
            <span>Внимание! При возврате платежа денежные средства вернутся только на то же платежное средство (банковскую карту, кошелек ЮMoney / Qiwi / Webmoney), с которого был произведен платеж. Обращаем ваше внимание,
              что необходимо предоставить Заявление на возврат.</span>
          </div>
        </li>
      </ul>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "delivery"
}
</script>

<style scoped lang="scss">
@import "~/assets/default.scss";

.w-50 {
  padding: 0 20px;
  width: 50%;
}
.page-header {
  h1 {
    font-family: 'Montserrat Light', sans-serif;
  }
}
.page-main{
  font-family: 'Montserrat', sans-serif;
  p{
    font-size: 18px;
    line-height: 30px;
    letter-spacing: 0.02em;
    margin: 15px 0;
  }
}
.w-100 {
  h6 {
    font-size: 1.1rem;
    letter-spacing: 0.03rem;
    line-height: 2.2rem;

    span {
      margin-left: 10px;
    }
  }
}
</style>
