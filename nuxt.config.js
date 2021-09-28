import colors from 'vuetify/es5/util/colors'
const imageminMozjpeg = require('imagemin-mozjpeg')
const ImageminPlugin = require('imagemin-webpack-plugin').default
const isDev = process.env.NODE_ENV !== 'production'

export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: '%s - showpet',
    title: 'showpet',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Интернет-магазин' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  loading: { color: '#ddd' },
  // Global CSS (https://go.nuxtjs.dev/config-css)
  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '~plugins/vue-the-mask.js',
    '~plugins/vue-moment.js',
    { src: '~/plugins/TiptapVuetify', mode: 'client' }
  ],
  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify'
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    'cookie-universal-nuxt',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap'
  ],
  robots: [
    {
      UserAgent: '*',
      Disallow: '/admin',
    },
  ],
  generate: {
    crawler: false
  },
  sitemap: {
    hostname: 'https://sportshow.store/',
    gzip: true,
    exclude: [
      '/admin',
      '/admin/advertising',
      '/admin/articles',
      '/admin/categories',
      '/admin/orders',
      '/admin/smsc',
      '/admin/users',
    ],
    routes: [
      '/catalog/sredstva-gigieny-i-kosmetika',
      '/catalog/sredstva-gigieny-i-kosmetika/shampuni',
      '/catalog/sredstva-gigieny-i-kosmetika/balzamy-i-maski',
      '/catalog/sredstva-gigieny-i-kosmetika/sprei-i-sredstva-dlya-gruminga',
      '/catalog/sredstva-gigieny-i-kosmetika/gigiena',
      '/catalog/soderzhanie',
      '/catalog/soderzhanie/kletky-i-boksi',
      '/catalog/soderzhanie/rascheski',
      '/catalog/korma',
      '/catalog/korma/dlya-koshek-sukhoi',
      '/catalog/korma/dlya-sobak-sukhoi',
      '/catalog/korma/dlya-koshek-vlazhnyi',
      '/catalog/korma/dlya-sobak-vlazhnyi',
      '/catalog/vitaminy',
      '/catalog/vitaminy/systavy-i-kosti',
      '/catalog/vitaminy/sherst',
      '/catalog/vitaminy/pishchevarenie',
      '/catalog/vitaminy/kompleks',
    ],
    defaults: {
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    }
  },

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseURL: 'http://eugenu.beget.tech/'
  },
  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    optimizeCss: false,
    filenames: {
      app: ({ isDev }) => isDev ? '[name].js' : 'js/[contenthash].js',
      chunk: ({ isDev }) => isDev ? '[name].js' : 'js/[contenthash].js',
      css: ({ isDev }) => isDev ? '[name].css' : 'css/[contenthash].css',
      img: ({ isDev }) => isDev ? '[path][name].[ext]' : 'img/[contenthash:7].[ext]',
      font: ({ isDev }) => isDev ? '[path][name].[ext]' : 'fonts/[contenthash:7].[ext]',
      video: ({ isDev }) => isDev ? '[path][name].[ext]' : 'videos/[contenthash:7].[ext]'
    },
    ...(!isDev && {
      html: {
        minify: {
          collapseBooleanAttributes: true,
          decodeEntities: true,
          minifyCSS: true,
          minifyJS: true,
          processConditionalComments: true,
          removeEmptyAttributes: true,
          removeRedundantAttributes: true,
          trimCustomFragments: true,
          useShortDoctype: true
        }
      }
    }),
    splitChunks: {
      layouts: true,
      pages: true,
      commons: true
    },
    optimization: {
      minimize: !isDev
    },
    ...(!isDev && {
      extractCSS: {
        ignoreOrder: true
      }
    }),
    transpile: ['vue-lazy-hydration','vuetify/lib', "tiptap-vuetify", 'intersection-observer','vuex-persist'],
    postcss: {
      plugins: {
      },
      ...(!isDev && {
        preset: {
          browsers: 'cover 99.5%',
          autoprefixer: true
        }
      })
    },
    extend (config, ctx) {
      const ORIGINAL_TEST = '/\\.(png|jpe?g|gif|svg|webp)$/i'
      const vueSvgLoader = [
        {
          loader: 'vue-svg-loader',
          options: {
            svgo: false
          }
        }
      ]
      const imageMinPlugin = new ImageminPlugin({
        pngquant: {
          quality: '5-30',
          speed: 7,
          strip: true
        },
        jpegtran: {
          progressive: true

        },
        gifsicle: {
          interlaced: true
        },
        plugins: [
          imageminMozjpeg({
            quality: 70,
            progressive: true
          })

        ]
      })
      if (!ctx.isDev) config.plugins.push(imageMinPlugin)

      config.module.rules.forEach(rule => {
        if (rule.test.toString() === ORIGINAL_TEST) {
          rule.test = /\.(png|jpe?g|gif|webp)$/i
          rule.use = [
            {
              loader: 'url-loader',
              options: {
                limit: 1000,
                name: ctx.isDev ? '[path][name].[ext]' : 'img/[contenthash:7].[ext]'
              }
            }
          ]
        }
      })
      //  Create the custom SVG rule
      const svgRule = {
        test: /\.svg$/,
        oneOf: [
          {
            resourceQuery: /inline/,
            use: vueSvgLoader
          },
          {
            resourceQuery: /data/,
            loader: 'url-loader'
          },
          {
            resourceQuery: /raw/,
            loader: 'raw-loader'
          },
          {
            loader: 'file-loader' // By default, always use file-loader
          }
        ]
      }

      config.module.rules.push(svgRule) // Actually add the rule
    }
  }
}
