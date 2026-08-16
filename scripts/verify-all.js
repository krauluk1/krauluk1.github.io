/**
 * Comprehensive Verification Script
 * Validates dynamic article rendering, JSON structures, English localization, YouTube embed,
 * Oslo Lightbox, Dancing article, WSDC points, and obstacle physics logic.
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
  assert(indexRes.body.includes('MISSION PROGRESS'), 'index.html contains English HUD "MISSION PROGRESS"');
  assert(indexRes.body.includes('Recruiter Fast-Pass'), 'index.html contains English "Recruiter Fast-Pass" button');
  assert(indexRes.body.includes('target="_blank"'), 'index.html footer links use target="_blank"');
  assert(indexRes.body.includes('privacy.html') && indexRes.body.includes('legal-notice.html'), 'index.html links to English privacy.html and legal-notice.html');

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

  // Verify external links in sector1 (Bosch AVP & PoDIUM) and sector5 (Dancing)
  const sector1Links = JSON.stringify(portfolio.sectors.sector1.links);
  assert(sector1Links.includes('automated-valet-parking') && sector1Links.includes('podium-project.eu'), 'Sector 1 contains Bosch AVP and PoDIUM official links');
  const sector5Links = JSON.stringify(portfolio.sectors.sector5.links);
  assert(sector5Links.includes('article.html?id=dancing'), 'Sector 5 contains Partner Dancing article link');
  assert(sector5Links.includes('article.html?id=oslo'), 'Sector 5 contains Oslo article link');

  // 3. Validate articles.json & YouTube URL
  const artRes = await fetchUrl('http://localhost:8000/assets/data/articles.json');
  assert(artRes.statusCode === 200, 'GET /assets/data/articles.json returns HTTP 200 OK');
  const articlesData = JSON.parse(artRes.body);
  const robocupArt = articlesData.robocup;
  const osloArt = articlesData.oslo;
  const danceArt = articlesData.dancing;
  assert(robocupArt && robocupArt.youtubeEmbedUrl === 'https://www.youtube.com/embed/N4QOX2h8s7Y', 'RoboCup article contains valid YouTube embed URL');
  assert(osloArt && osloArt.gallery.length === 4, 'Oslo article contains 4 gallery items');
  assert(danceArt && danceArt.wsdcProfile.wsdcId === '28427', 'Dancing article contains WSDC ID 28427');

  // 4. Validate legal.json
  const legRes = await fetchUrl('http://localhost:8000/assets/data/legal.json');
  assert(legRes.statusCode === 200, 'GET /assets/data/legal.json returns HTTP 200 OK');
  const legal = JSON.parse(legRes.body);
  assert(legal.privacy.title === 'Privacy Policy', 'legal.json contains Privacy Policy');
  assert(legal.legalNotice.title.includes('Legal Notice'), 'legal.json contains Legal Notice');

  // 5. Validate Universal Dynamic article.html template
  const articleRes = await fetchUrl('http://localhost:8000/article.html');
  assert(articleRes.statusCode === 200, 'GET /article.html returns HTTP 200 OK');
  assert(articleRes.body.includes('loadArticle') && articleRes.body.includes('assets/data/articles.json'), 'article.html dynamically fetches and renders articles.json');
  assert(articleRes.body.includes('cyber-lightbox'), 'article.html includes interactive photo lightbox');

  // 6. Validate Privacy & Legal pages
  const privRes = await fetchUrl('http://localhost:8000/privacy.html');
  assert(privRes.statusCode === 200 && privRes.body.includes('General Data Protection Regulation'), 'privacy.html is GDPR compliant in English');

  const noticeRes = await fetchUrl('http://localhost:8000/legal-notice.html');
  assert(noticeRes.statusCode === 200 && noticeRes.body.includes('German Telemedia Act'), 'legal-notice.html is §5 TMG compliant in English');

  // 7. Validate Obstacle Physics & World in world.js
  const worldJs = fs.readFileSync(path.join(ROOT_DIR, 'assets/js/game/world.js'), 'utf8');
  assert(worldJs.includes('this.width = 3200') && worldJs.includes('this.height = 3200'), 'world.js uses expanded 3200x3200 world canvas');
  assert(worldJs.includes('checkObstacleCollision'), 'world.js implements checkObstacleCollision method');
  assert(worldJs.includes('crater_nw') && worldJs.includes('Crater Alpha'), 'world.js contains impact crater obstacles');

  // 8. Validate Rover Collision handling in rover.js
  const roverJs = fs.readFileSync(path.join(ROOT_DIR, 'assets/js/game/rover.js'), 'utf8');
  assert(roverJs.includes('checkObstacleCollision'), 'rover.js executes obstacle collision detection');
  assert(roverJs.includes('playBump'), 'rover.js triggers collision sound on obstacle contact');

  // 9. Validate Audio bump sound
  const audioJs = fs.readFileSync(path.join(ROOT_DIR, 'assets/js/game/audio.js'), 'utf8');
  assert(audioJs.includes('playBump'), 'audio.js includes synthesized playBump sound effect');

  // 10. Validate No Email in public content/portfolio/modals
  assert(!JSON.stringify(portfolio.socialLinks).includes('@'), 'portfolio.json does not contain email in socialLinks');
  const contentJs = fs.readFileSync(path.join(ROOT_DIR, 'assets/js/game/content.js'), 'utf8');
  assert(!contentJs.includes('mailto:'), 'content.js does not contain email addresses');

  // 11. Validate No Generic GitHub in Social Connection Links (Only LinkedIn & XING)
  assert(!portfolio.socialLinks.some(s => s.name === 'GitHub'), 'portfolio.socialLinks does not contain GitHub connection link');
  assert(portfolio.socialLinks.some(s => s.name === 'LinkedIn') && portfolio.socialLinks.some(s => s.name === 'Xing'), 'portfolio.socialLinks contains LinkedIn and Xing');

  // 12. Validate Fast-Pass Guard & Victory Celebration in hud.js
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
