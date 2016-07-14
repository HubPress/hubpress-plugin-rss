import RSS from 'rss'

export function rssPlugin (hubpress) {

  hubpress.on('requestGenerateIndex', (opts) => {
    console.info('RSS Plugin - requestGenerateIndex');
    console.log('requestGenerateIndex', opts);

    const site = opts.data.config.site;
    const posts = opts.data.publishedPosts;
    if (!posts || !posts.length)
      return opts;


      /* lets create an rss feed */
    const feed = new RSS({
        title: site.title || '',
        description: site.description || '',
        feed_url: `${site.url}/rss/`,
        site_url: site.url,
        image_url: site.cover,
        ttl: '60'
    });

    posts.forEach(post => {
      /* loop over data and add to feed */
      feed.item({
        title:  post.title,
        description: post.html,
        url: `${site.url}${post.url}`, // link to the item
        categories: post.tags, // optional - array of item categories
        author: post.author.name, // optional - defaults to feed author property
        date: post.published_at // any format that js Date can parse.
      });
    });

    const xml = feed.xml();
    const feedsToPublish = [];
    feedsToPublish.push({
      name:`RSS`,
      path: 'rss/index.xml',
      content: xml,
      message: `Publish rss feed`
    });

    const elementsToPublish = (opts.data.elementsToPublish || []).concat(feedsToPublish);
    const data = Object.assign({}, opts.data, {elementsToPublish});
    return Object.assign({}, opts, {data});
  });
}
