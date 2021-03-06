/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {

  environments: {
    development: {
      url: 'http://localhost:1337',
      constants: {
        BASE: {
          protocol: 'http',
          host : 'localhost',
          port: '1337',
          prefix: '/api'
        }
      }
    },
    migrate: {
      url: 'http://ws69.uhnresearch.ca:1338',
      constants: {
        BASE: {
          protocol: 'http',
          host : 'ws69.uhnresearch.ca',
          port: '1338',
          prefix: '/api'
        }
      }
    },
    uat: {
      url: 'http://10.7.8.121:1338',
      constants: {
        BASE: {
          protocol: 'http',
          host : '10.7.8.121',
          port: '1338',
          prefix: '/api'
        }
      }
    },
    staging: {
      url: 'http://10.7.8.119:1338',
      constants: {
        BASE: {
          protocol: 'http',
          host : '10.7.8.119',
          port: '1338',
          prefix: '/api'
        }
      }
    },
    demo: {
      url: 'http://10.7.8.118:1338',
      constants: {
        BASE: {
          protocol: 'http',
          host : '10.7.8.118',
          port: '1338',
          prefix: '/api'
        }
      }
    },
    production: {
      url: 'http://10.3.128.48:1338',
      constants: {
        BASE: {
          protocol: 'http',
          host : '10.3.128.48',
          port: '1338',
          prefix: '/api'
        }
      }
    }
  },

  /**
   * The `build_dir` folder is where our projects are compiled during
   * development and the `compile_dir` folder is where our app resides once it's
   * completely built.
   */
  build_dir: 'build',
  compile_dir: 'bin',

  /**
   * This is a collection of file patterns that refer to our app code (the
   * stuff in `src/`). These file paths are used in the configuration of
   * build tasks. `js` is all project javascript, less tests. `ctpl` contains
   * our reusable components' (`src/common`) template HTML files, while
   * `atpl` contains the same, but for our app's code. `html` is just our
   * main HTML file, `less` is our main stylesheet, and `unit` contains our
   * app's unit tests.
   */
  app_files: {
    js: ['src/**/*.js', '!src/**/*.spec.js', '!src/assets/**/*.js'],
    jsunit: ['src/**/*.spec.js'],

    ts: ['src/**/*.ts', '!src/**/*.spec.ts', '!src/assets/**/*.ts'],
    tsunit: ['src/**/*.spec.ts'],

    atpl: ['src/app/**/*.tpl.html'],
    ctpl: ['src/common/**/*.tpl.html'],

    html: ['src/index.html'],
    less: 'src/less/main.less'
  },

  /**
   * This is a collection of files used during testing only.
   */
  test_files: {
    js: [
      'vendor/angular-mocks/angular-mocks.js'
    ]
  },

  /**
   * This is the same as `app_files`, except it contains patterns that
   * reference vendor code (`vendor/`) that we need to place into the build
   * process somewhere. While the `app_files` property ensures all
   * standardized files are collected for compilation, it is the user's job
   * to ensure non-standardized (i.e. vendor-related) files are handled
   * appropriately in `vendor_files.js`.
   *
   * The `vendor_files.js` property holds files to be automatically
   * concatenated and minified with our project source files.
   *
   * The `vendor_files.css` property holds any CSS files to be automatically
   * included in our app.
   *
   * The `vendor_files.assets` property holds any assets to be copied along
   * with our app's assets. This structure is flattened, so it is not
   * recommended that you use wildcards.
   */
  vendor_files: {
    js: [
      // angular dependencies
      'vendor/jquery/dist/jquery.js',
      'vendor/jquery-ui/jquery-ui.js',
      'vendor/lodash/lodash.js',
      'vendor/showdown/src/showdown.js',
      'vendor/sails.io.js/dist/sails.io.js',
      'sails-io-settings.js',

      'vendor/angular/angular.js',
      'vendor/angular-animate/angular-animate.js',
      'vendor/angular-loader/angular-loader.js',
      'vendor/moment/moment.js',
      'vendor/angular-moment/angular-moment.js',
      'vendor/angular-local-storage/dist/angular-local-storage.js',
      'vendor/angular-sanitize/angular-sanitize.js',
      'vendor/angular-aria/angular-aria.js',
      'vendor/angular-material/angular-material.js',
      'vendor/angular-resource/angular-resource.js',
      'vendor/angular-cookie/angular-cookie.js',
      'vendor/angular-cookies/angular-cookies.js',
      'vendor/angular-bootstrap/ui-bootstrap-tpls.js',
      'vendor/angular-resource/angular-resource.js',
      'vendor/angular-ui-router/release/angular-ui-router.js',
      'vendor/angular-multi-select/isteven-multi-select.js',
      'vendor/angularSails/dist/ngsails.io.js',
      'vendor/angular-toastr/dist/angular-toastr.tpls.js',
      'vendor/angular-timeline/dist/angular-timeline.js',
      'vendor/angular-scroll-animate/dist/angular-scroll-animate.js',
      'vendor/angular-filter/dist/angular-filter.js',
      'vendor/angular-ui-tree/dist/angular-ui-tree.js',
      'vendor/angular-markdown-directive/markdown.js',
      'vendor/ng-table/dist/ng-table.js',
      'vendor/angular-ui-validate/dist/validate.js',
      'vendor/angular-ui-sortable/sortable.js',
      'vendor/ace-builds/src/ace.js',
      'vendor/ace-builds/src/theme-crimson_editor.js',
      'vendor/ace-builds/src/mode-javascript.js',
      'vendor/ace-builds/src/mode-markdown.js',
      'vendor/ace-builds/src/worker-javascript.js',
      'vendor/angular-ui-ace/ui-ace.js',
      'vendor/angular-google-maps/dist/angular-google-maps.js',
      'vendor/angular-simple-logger/dist/angular-simple-logger.js',
      'vendor/angular-local-storage/dist/angular-local-storage.js',

      // translation libs
      'vendor/defiant.js/dist/defiant.js',
      'vendor/angular-translate/angular-translate.js',
      'vendor/angular-translate-editor/dist/angular-translate-editor.js',
      'vendor/angular-translate-handler-log/angular-translate-handler-log.js',
      'vendor/angular-translate-loader-url/angular-translate-loader-url.js',
      'vendor/angular-translate-storage-cookie/angular-translate-storage-cookie.js',
      'vendor/angular-translate-storage-local/angular-translate-storage-local.js',
      'vendor/angular-dynamic-locale/dist/tmhDynamicLocale.js',
      'vendor/angular-i18n/angular-locale_en-us.js',
      'vendor/angular-i18n/angular-locale_fr.js',

      // plugins
      'vendor/JSONedit/js/directives.js',
      'vendor/ui-select/dist/select.min.js'
    ],
    css: [
    ],
    assets: [
      'vendor/bootstrap/dist/fonts/*',
      'vendor/font-awesome/fonts/*',
      'vendor/roboto-fontface/fonts/Roboto-Regular.*',
      'vendor/angular-ui-grid/ui-grid.eot',
      'vendor/angular-ui-grid/ui-grid.svg',
      'vendor/angular-ui-grid/ui-grid.ttf',
      'vendor/angular-ui-grid/ui-grid.woff'
    ]
  }
};
