export default class Article {
  public static getTypes = [
    {name: 'Новость или Акция', value: 'NEWS'},
    {name: 'Статья', value: 'ARTICLE'}
  ]

  text: any;
  type: any;
  slug: any;
  picture: any;
  created_date: any;
  published_date: any;

  constructor() {
    this.text = '';
    this.type = 'ARTICLE';
  }

  public static transformHTML(text: string) {
    return text.split('<h1>').join('<h1 class="mb-4">')
      .split('<h2>').join('<h2 class="mb-3">')
      .split('<h3>').join('<h2 class="mb-3">')
      .split('<h4>').join('<h2 class="mb-2">')
      .split('<h5>').join('<h2 class="mb-2">')
      .split('<h6>').join('<h2 class="mb-2">')
  }
}
