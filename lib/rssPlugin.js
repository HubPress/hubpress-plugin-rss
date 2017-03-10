'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rssPlugin = rssPlugin;

var _rss = require('rss');

var _rss2 = _interopRequireDefault(_rss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function rssPlugin(hubpress) {

  hubpress.on('requestGenerateIndex', function (opts) {
    console.info('rssPlugin - requestGenerateIndex');
    console.log('rssPlugin - requestGenerateIndex', opts);

    var site = opts.rootState.application.config.site || {};
    var siteUrl = opts.rootState.application.config.urls.site || '';
    var posts = opts.nextState.publishedPosts || [];

    /* lets create an rss feed */
    var feed = new _rss2.default({
      title: site.title || '',
      description: site.description || '',
      feed_url: siteUrl + '/rss/',
      site_url: siteUrl,
      image_url: site.cover,
      ttl: '60'
    });

    posts.forEach(function (post) {
      /* loop over data and add to feed */
      feed.item({
        title: post.title,
        description: post.html,
        url: '' + siteUrl + post.url, // link to the item
        categories: post.tags, // optional - array of item categories
        author: post.author.name, // optional - defaults to feed author property
        date: post.published_at // any format that js Date can parse.
      });
    });

    var xml = feed.xml();
    var feedsToPublish = [];
    feedsToPublish.push({
      name: 'RSS',
      path: 'rss/index.xml',
      content: xml,
      message: 'Publish rss feed'
    });

    opts.nextState.elementsToPublish = (opts.nextState.elementsToPublish || []).concat(feedsToPublish);
    return opts;
  });
}