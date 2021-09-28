export default class Advert {
  text: any;
  picture: any;
  link: any;
  date_start: any;
  date_end: any;

  constructor() {
    this.text = '';
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
