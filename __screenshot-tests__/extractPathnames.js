const cheerio = require('cheerio');
const fs = require('fs');

const sitemapPath = './build/sitemap.xml';

// Extract a list of pathnames, given a fs path to a sitemap.xml file
const extractSitemapPathnames = (sitemapPath) => {
  const sitemap = fs.readFileSync(sitemapPath).toString();
  const $ = cheerio.load(sitemap, { xmlMode: true });
  const urls = [];
  $('loc').each(function handleLoc() {
    urls.push($(this).text());
  });
  return urls.map((url) => new URL(url).pathname);
};

const extractPathnames = () =>
  fs.writeFileSync('argos/pathnames.json', JSON.stringify(extractSitemapPathnames(sitemapPath), null, 2));

extractPathnames();
