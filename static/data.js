export const categories = [
  {
    id: -1,
    name: "Все",
    link: "all",
    subs: [
      {
        name: "Все",
        link: "all"
      }
    ]
  },
   {
      "id": 0,
      "name": "Средства гигиены и косметика",
      "link": "sredstva-gigieny-i-kosmetika",
      "pic": "categories/средства гигиены и косметика.jpg",
      "subs": [
        {
          "name": "Шампуни",
          "link": "shampuni",
    	  "pic": "categories/шампуни.jpg"
        },
        {
          "name": "Бальзамы и маски",
          "link": "balzamy-i-maski",
    	  "pic": "categories/бальзамы и маски.jpg"
        },
        {
          "name": "Спреи и средства для груминга",
          "link": "sprei-i-sredstva-dlya-gruminga",
    	  "pic": "categories/спреи и средства для груминга.jpg"
        },
        {
          "name": "Гигиена",
          "link": "gigiena",
    	  "pic": "categories/гигиена.jpg"
        }
      ]
    },
  {
    id: 1,
    name: "Содержание",
    link: "soderzhanie",
    	  "pic": "categories/Содержание.jpg",
    subs: [
      {
        name: "Клетки и боксы",
        link: "kletky-i-boksi",
    	  "pic": "categories/клетки и боксы.jpg"
      },
      {
        name: "Расчески",
        link: "rascheski",
    	  "pic": "categories/расчески.jpg"
      },
      {
        name: "Другое",
        link: "drugoe",
    	  "pic": "categories/другое.jpg"
      }
    ]
  },
  {
      "id": 2,
      "name": "Корма",
      "link": "korma",
    	  "pic": "categories/Корма.jpg",
      "subs": [
        {
          "name": "Для кошек (сухой)",
          "link": "dlya-koshek-sukhoi",
    	  "pic": "categories/для кошек (сухой).jpg"
        },
        {
          "name": "Для кошек (влажный)",
          "link": "dlya-koshek-vlazhnyi",
    	  "pic": "categories/для кошек (влажный).jpg"
        },
        {
          "name": "Для собак (сухой)",
          "link": "dlya-sobak-sukhoi",
    	  "pic": "categories/для собак (сухой).jpg"
        },
        {
          "name": "Для собак (влажный)",
          "link": "dlya-sobak-vlazhnyi",
    	  "pic": "categories/для собак (влажный).jpg"
        }
      ]
    },
  {
      "id": 3,
      "name": "Витамины",
      "link": "vitaminy",
    	  "pic": "categories/Витамины.jpg",
      "subs": [
        {
          "name": "Суставы и кости",
          "link": "systavy-i-kosti",
    	  "pic": "categories/суставы и кости.jpg"
        },
        {
          "name": "Шерсть",
          "link": "sherst",
    	  "pic": "categories/шерсть.jpg"
        },
        {
          "name": "Пищеварение",
          "link": "pishchevarenie",
    	  "pic": "categories/пищеварение.jpg"
        },
        {
          "name": "Комплекс",
          "link": "kompleks",
    	  "pic": "categories/комплекс.jpg"
        }
      ]
    }
];

export const age = [
  {
    id: 0,
    name: "Всех возрастов",
    value: "all"
  },
  {
    id: 1,
    name: "Котенок/Щенок",
    value: "young"
  },
  {
    id: 2,
    name: "Взрослый",
    value: "adult"
  },
  {
    id: 3,
    name: "Пожилой",
    value: "old"
  }
];

export const flavor = [
  {
    id: 0,
    name: "Мясо",
    value: "meat"
  },
  {
    id: 1,
    name: "Птица",
    value: "bird"
  },
  {
    id: 2,
    name: "Рыба",
    value: "fish"
  },
  {
    id: 3,
    name: "Смешанное",
    value: "mixed"
  },
  {
    id: 4,
    name: "Вет. диета",
    value: "vet-diet"
  },
  {
    id: 5,
    name: "Другое",
    value: "other"
  }
];

export const sizes = [
	{
		id: 0,
		name: "Крупный",
		value: "big"
	},
	{
		id: 1,
		name: "Средний",
		value: "medium"
	},
	{
		id: 2,
		name: "Мелкий",
		value: "small"
	},
	{
		id: 3,
		name: "Все размеры",
		value: "all"
	}
];

export const STATE_CHOICES = [
  {value: 'NEW', name: 'Новый'},
  {value: 'EQUIPPING', name: 'Комплектация'},
  {value: 'ASSEMBLED', name: 'Укомплектован'},
  {value: 'TO_DELIVERY', name: 'Передан в доставку'},
  {value: 'COMPLETED', name: 'Выполнен/Доставлен'},
  {value: 'CANCELED', name: 'Отменен'}
]

export const PAY_CHOICES = [
  {value: 'CASH', name: 'Оплата наличными'},
  {value: 'NONCASH', name: 'Оплата картой'},
  {value: 'ONLINE', name: 'Оплата онлайн'}
]

export const PAY_STATE = [
  {value: 'NOT_PAYED', name: 'Не оплачено'},
  {value: 'IN_PROCESS', name: 'В процессе'},
  {value: 'PAYED', name: 'Оплачено'},
  {value: 'ERROR', name: 'Ошибка оплаты'},
  {value: 'CANCELED', name: 'Отмена оплаты'}
]
