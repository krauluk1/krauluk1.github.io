/**
 * Comprehensive Verification Script
 * Validates zero-duplication architecture (SOLID / KISS), pure JSON data stores,
 * pages/ folder structure, English localization, YouTube embed,
 * Oslo Lightbox, Dancing article, WSDC points, obstacle physics, and fast-pass guard.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
let testCount = 0;
let passCount = 0;
let failCount = 0;

function assert(condition, testName) {
  testCount++;
  if (condition) {
    console.log(`\x1b[32m✔ PASS [${testCount}]:\x1b[0m ${testName}`);
    passCount++;
  } else {
    console.error(`\x1b[31m✖ FAIL [${testCount}]:\x1b[0m ${testName}`);
    failCount++;
  }
}

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('--- Starting Comprehensive Integration & Verification Suite ---\n');

  // 1. Check HTTP server response on index.html
  const indexRes = await fetchUrl('http://localhost:8000/index.html');
  assert(indexRes.statusCode === 200, 'GET /index.html returns HTTP 200 OK');
  assert(indexRes.body.includes('Fast-Pass') && indexRes.body.includes('id="reset-btn"'), 'index.html contains Fast-Pass and front-page Reset buttons');
  assert(indexRes.body.includes('id="touch-controls"') && indexRes.body.includes('id="touch-up"'), 'index.html contains mobile touch virtual d-pad controls');
  assert(indexRes.body.includes('target="_blank"'), 'index.html footer links use target="_blank"');
  assert(indexRes.body.includes('pages/privacy.html') && indexRes.body.includes('pages/legal-notice.html'), 'index.html links to pages/privacy.html and pages/legal-notice.html');

  // 2. Validate portfolio.json
  const portRes = await fetchUrl('http://localhost:8000/assets/data/portfolio.json');
  assert(portRes.statusCode === 200, 'GET /assets/data/portfolio.json returns HTTP 200 OK');
  const portfolio = JSON.parse(portRes.body);
  const sectorKeys = Object.keys(portfolio.sectors);
  assert(sectorKeys.length === 5, `portfolio.json has exactly 5 sectors (found ${sectorKeys.length})`);
  assert(portfolio.subItems.length === 26, `portfolio.json has exactly 26 sub-items (found ${portfolio.subItems.length})`);

  // Verify all 5 sectors exist
  assert(portfolio.sectors.sector1.name.includes('Work Experience'), 'Sector 1 is Work Experience');
  assert(portfolio.sectors.sector2.name.includes('Academic Education'), 'Sector 2 is Academic Education');
  assert(portfolio.sectors.sector3.name.includes('IT & Technical Skills'), 'Sector 3 is IT & Technical Skills');
  assert(portfolio.sectors.sector4.name.includes('Qualifications & Certificates'), 'Sector 4 is Qualifications & Certificates');
  assert(portfolio.sectors.sector5.name.includes('Volunteering & Interests'), 'Sector 5 is Volunteering & Interests');

  // Verify Bosch AVP link is REMOVED and PoDIUM is present in sector1
  const sector1Links = JSON.stringify(portfolio.sectors.sector1.links);
  assert(!sector1Links.includes('automated-valet-parking'), 'Sector 1 does NOT contain old Bosch AVP link (successfully removed)');
  assert(sector1Links.includes('podium-project.eu'), 'Sector 1 contains official EU PoDIUM project link');

  // Verify Sector 2 and Sector 5 dedicated links point to pages/
  const sector2Links = JSON.stringify(portfolio.sectors.sector2.links);
  assert(sector2Links.includes('pages/article-robocup.html'), 'Sector 2 contains direct pages/article-robocup.html link');

  const sector5Links = JSON.stringify(portfolio.sectors.sector5.links);
  assert(sector5Links.includes('pages/article-dancing.html'), 'Sector 5 contains direct pages/article-dancing.html link');
  assert(sector5Links.includes('pages/article-oslo.html'), 'Sector 5 contains direct pages/article-oslo.html link');

  // 3. Validate articles.json (Single Source of Truth)
  const artRes = await fetchUrl('http://localhost:8000/assets/data/articles.json');
  assert(artRes.statusCode === 200, 'GET /assets/data/articles.json returns HTTP 200 OK');
  const articlesData = JSON.parse(artRes.body);
  const robocupArt = articlesData.robocup;
  const osloArt = articlesData.oslo;
  const danceArt = articlesData.dancing;
  assert(robocupArt && robocupArt.youtubeEmbedUrl === 'https://www.youtube.com/embed/N4QOX2h8s7Y', 'RoboCup article in JSON contains valid YouTube embed URL');
  assert(robocupArt.responsibility.includes('object detection') && robocupArt.responsibility.includes('gripping point detection') && robocupArt.responsibility.includes('autonomous gripping'), 'RoboCup article in JSON contains clean concise responsibility statement');
  assert(osloArt && osloArt.gallery.length === 4, 'Oslo article in JSON contains 4 gallery items');
  assert(danceArt && danceArt.wsdcProfile.wsdcId === '28427', 'Dancing article in JSON contains WSDC ID 28427');

  // 4. Validate legal.json (Single Source of Truth)
  const legRes = await fetchUrl('http://localhost:8000/assets/data/legal.json');
  assert(legRes.statusCode === 200, 'GET /assets/data/legal.json returns HTTP 200 OK');
  const legal = JSON.parse(legRes.body);
  assert(legal.privacy.title === 'Privacy Policy', 'legal.json contains Privacy Policy');
  assert(legal.legalNotice.title.includes('Legal Notice'), 'legal.json contains Legal Notice');

  // 5. Validate Zero-Duplication Shells and Dynamic Renderers in pages/
  const rendererRes = await fetchUrl('http://localhost:8000/assets/js/article-renderer.js');
  assert(rendererRes.statusCode === 200 && rendererRes.body.includes('renderArticle') && rendererRes.body.includes('articles.json'), 'article-renderer.js dynamically fetches and renders articles.json');

  const legalRendererRes = await fetchUrl('http://localhost:8000/assets/js/legal-renderer.js');
  assert(legalRendererRes.statusCode === 200 && legalRendererRes.body.includes('renderLegal') && legalRendererRes.body.includes('legal.json'), 'legal-renderer.js dynamically fetches and renders legal.json');

  const robocupRes = await fetchUrl('http://localhost:8000/pages/article-robocup.html');
  assert(robocupRes.statusCode === 200 && robocupRes.body.includes('article-renderer.js') && robocupRes.body.includes('data-article="robocup"'), 'pages/article-robocup.html is a clean zero-duplication shell');

  const osloRes = await fetchUrl('http://localhost:8000/pages/article-oslo.html');
  assert(osloRes.statusCode === 200 && osloRes.body.includes('article-renderer.js') && osloRes.body.includes('data-article="oslo"'), 'pages/article-oslo.html is a clean zero-duplication shell');

  const danceRes = await fetchUrl('http://localhost:8000/pages/article-dancing.html');
  assert(danceRes.statusCode === 200 && danceRes.body.includes('article-renderer.js') && danceRes.body.includes('data-article="dancing"'), 'pages/article-dancing.html is a clean zero-duplication shell');

  const privRes = await fetchUrl('http://localhost:8000/pages/privacy.html');
  assert(privRes.statusCode === 200 && privRes.body.includes('legal-renderer.js') && privRes.body.includes('data-legal="privacy"'), 'pages/privacy.html is a clean zero-duplication shell');

  const noticeRes = await fetchUrl('http://localhost:8000/pages/legal-notice.html');
  assert(noticeRes.statusCode === 200 && noticeRes.body.includes('legal-renderer.js') && noticeRes.body.includes('data-legal="legal-notice"'), 'pages/legal-notice.html is a clean zero-duplication shell');

  // 6. Validate Obstacle Physics & World in world.js
  const worldJs = fs.readFileSync(path.join(ROOT_DIR, 'assets/js/game/world.js'), 'utf8');
  assert(worldJs.includes('this.width = 3200') && worldJs.includes('this.height = 3200'), 'world.js uses expanded 3200x3200 world canvas');
  assert(worldJs.includes('checkObstacleCollision'), 'world.js implements checkObstacleCollision method');
  assert(worldJs.includes('crater_nw') && worldJs.includes('Crater Alpha'), 'world.js contains impact crater obstacles');

  // 7. Validate Rover Collision handling in rover.js
  const roverJs = fs.readFileSync(path.join(ROOT_DIR, 'assets/js/game/rover.js'), 'utf8');
  assert(roverJs.includes('checkObstacleCollision'), 'rover.js executes obstacle collision detection');
  assert(roverJs.includes('playBump'), 'rover.js triggers collision sound on obstacle contact');

  // 8. Validate Audio bump sound
  const audioJs = fs.readFileSync(path.join(ROOT_DIR, 'assets/js/game/audio.js'), 'utf8');
  assert(audioJs.includes('playBump'), 'audio.js includes synthesized playBump sound effect');

  // 9. Validate No Email in public content/portfolio/modals
  assert(!JSON.stringify(portfolio.socialLinks).includes('@'), 'portfolio.json does not contain email in socialLinks');
  const contentJs = fs.readFileSync(path.join(ROOT_DIR, 'assets/js/game/content.js'), 'utf8');
  assert(!contentJs.includes('mailto:'), 'content.js does not contain email addresses');

  // 10. Validate No Generic GitHub in Social Connection Links (Only LinkedIn & XING)
  assert(!portfolio.socialLinks.some(s => s.name === 'GitHub'), 'portfolio.socialLinks does not contain GitHub connection link');
  assert(portfolio.socialLinks.some(s => s.name === 'LinkedIn') && portfolio.socialLinks.some(s => s.name === 'Xing'), 'portfolio.socialLinks contains LinkedIn and Xing');

  // 11. Validate Fast-Pass Guard & Victory Celebration in hud.js
  const hudJs = fs.readFileSync(path.join(ROOT_DIR, 'assets/js/game/hud.js'), 'utf8');
  assert(hudJs.includes('isFastPassActive = true'), 'hud.js activates isFastPassActive flag on fast-pass click');
  assert(hudJs.includes('!this.isFastPassActive'), 'hud.js prevents victory modal on Fast-Pass unlock');
  assert(hudJs.includes('openVictoryModal'), 'hud.js implements 100% victory celebration modal for natural gameplay');

  console.log(`\n================================`);
  console.log(`Verification Summary: ${passCount} Passed, ${failCount} Failed.`);
  console.log(`================================\n`);

  if (failCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
