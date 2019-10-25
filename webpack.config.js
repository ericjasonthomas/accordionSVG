const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
// const StyleLintPlugin = require('stylelint-webpack-plugin');
const postcss = require('postcss');
const postcssSVG = require('postcss-svg');


module.exports = {

  context: __dirname,
  //  entry: ['./src/index.js','./src/sass/noncritical/style.scss','./src/sass/critical/critical.scss'],
  //  entry: ['./src/index.js','./src/sass/noncritical/style.scss','./src/sass/critical/critical.scss'],
	entry: {
   // "js/index": ['./src/index.js'],
		"js/script": ['./src/js/script.js'],
    "css/style": ['./src/sass/noncritical/style.scss'],
    "css/critical": ['./src/sass/critical/critical.scss'],
	},
  output: {
     path: path.resolve(__dirname, 'themes/mytheme/'),
		 publicPath: '/themes/mytheme/',
  },
	devServer: {
    contentBase: path.join(__dirname, './themes/mytheme/'),
    compress: true,
    port: 8000
  },
	optimization: {
    minimizer: [
			new TerserJSPlugin({}), 
			new OptimizeCSSAssetsPlugin({
				cssProcessorPluginOptions: {
				assetNameRegExp: /\.optimize\.css$/g,
        preset: ['default', { discardComments: { removeAll: true } }],
      },
      canPrint: true
			})],
  },
  plugins: [
    new MiniCssExtractPlugin({
      //filename: "../../wordpress/wp-content/themes/lincolntech/css/style-litt.css",
    }),
		new BrowserSyncPlugin({
       files: '../themes/mytheme/**/*.html',
       proxy: 'http://localhost:8000',
    }),
	  new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
			"window.jQuery": "jquery",
    }),

	//	new SpriteLoaderPlugin(),
  ],
  mode: 'development',
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.css', 'scss'],
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        exclude: /node_modules/,
        test: /\.jsx$/,
        loader: 'eslint-loader'
      },
      {
        test: /\.jsx?$/,
				exclude: /node_module/,
       	// loader: 'babel-loader',
      },
			{
        test: /\.(scss|sass)$/,
				use: [
					//'style-loader',
          // { loader: 'css-loader', options: { importLoaders: 1 } },
          // { loader: 'postcss-loader', options: {
          //   ident: 'postcss',
          //   plugins: () => [
          //     postcssSVG({
					// 			utf8: true,
					// 			svgo: { plugins: [{ 
					// 				cleanupAttrs: false,
									
					// 			 }] }
					// 		})
          //   ]
          // } },
					{
           loader: MiniCssExtractPlugin.loader,
						 options: {
            //   // you can specify a publicPath here
            //   // by default it uses publicPath in webpackOptions.output
            // publicPath: '/themes/mytheme/css',
						 		outputPath: 'css',
						// 	// path: publicPath + '/css',
            //   // hmr: process.env.NODE_ENV === 'development',
						 		sourceMap: true,
							 	esModule: false,
             },
         	},
           {
						loader: 'css-loader',
						 options: {
							sourceMap: true,
							// url: false,
						 }
					 },
					 { 
						 loader: 'postcss-loader', options: {
		          ident: 'postcss',
		          plugins: () => [
		            postcssSVG({
									 svgo: { plugins: [{ cleanupAttrs: false }] }
								})
		          ]
		        	} 
						},
           {
						 loader: 'sass-loader',
						 options: {
							sourceMap: true,
						 }
					 },
        ]
      },
			{
        test: /\.svg$/,
        loader: 'svg-url-loader'
    },
	   {
          test: /\.(png|jpe?g|gif|svg|ico)(\?.*)?$/,
          loader: 'url-loader',
          include: path.resolve(__dirname, '/images'), // new line
          options: {
              name: '[name].[ext]'
          }
		 },
    ]
  },
};
