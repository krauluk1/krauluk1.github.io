/**
 * Comprehensive Verification Script
 * Validates all endpoints, JSON structures, English localization, YouTube embed, and obstacle physics logic.
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

  // 3. Validate articles.json & YouTube URL
  const artRes = await fetchUrl('http://localhost:8000/assets/data/articles.json');
  assert(artRes.statusCode === 200, 'GET /assets/data/articles.json returns HTTP 200 OK');
  const articles = JSON.parse(artRes.body);
  assert(articles.robocup.youtubeEmbedUrl === 'https://www.youtube.com/embed/N4QOX2h8s7Y', 'RoboCup article contains valid YouTube embed URL');
  assert(articles.oslo.gallery.length === 4, 'Oslo article contains 4 gallery items');

  // 4. Validate legal.json
  const legRes = await fetchUrl('http://localhost:8000/assets/data/legal.json');
  assert(legRes.statusCode === 200, 'GET /assets/data/legal.json returns HTTP 200 OK');
  const legal = JSON.parse(legRes.body);
  assert(legal.privacy.title === 'Privacy Policy', 'legal.json contains Privacy Policy');
  assert(legal.legalNotice.title.includes('Legal Notice'), 'legal.json contains Legal Notice');

  // 5. Validate RoboCup HTML page & YouTube iframe
  const roboRes = await fetchUrl('http://localhost:8000/blog-details/roboCupAtWork1.html');
  assert(roboRes.statusCode === 200, 'GET /blog-details/roboCupAtWork1.html returns HTTP 200 OK');
  assert(roboRes.body.includes('https://www.youtube.com/embed/N4QOX2h8s7Y'), 'RoboCup HTML contains embedded YouTube iframe player');
  assert(roboRes.body.includes('video-wrapper'), 'RoboCup HTML utilizes responsive .video-wrapper');
  assert(roboRes.body.includes('Autonomous Mobile Manipulation at RoboCup@Work 2021'), 'RoboCup HTML is in English');

  // 6. Validate Oslo HTML page
  const osloRes = await fetchUrl('http://localhost:8000/blog-details/osloNorwegen1.html');
  assert(osloRes.statusCode === 200, 'GET /blog-details/osloNorwegen1.html returns HTTP 200 OK');
  assert(osloRes.body.includes('Vigelandsanlegget') && osloRes.body.includes('Oslo Opera House'), 'Oslo HTML contains English photo gallery');

  // 7. Validate Privacy & Legal pages
  const privRes = await fetchUrl('http://localhost:8000/privacy.html');
  assert(privRes.statusCode === 200 && privRes.body.includes('General Data Protection Regulation'), 'privacy.html is GDPR compliant in English');

  const noticeRes = await fetchUrl('http://localhost:8000/legal-notice.html');
  assert(noticeRes.statusCode === 200 && noticeRes.body.includes('German Telemedia Act'), 'legal-notice.html is §5 TMG compliant in English');

  // 8. Validate Obstacle Physics & World in world.js
  const worldJs = fs.readFileSync(path.join(ROOT_DIR, 'assets/js/game/world.js'), 'utf8');
  assert(worldJs.includes('this.width = 3200') && worldJs.includes('this.height = 3200'), 'world.js uses expanded 3200x3200 world canvas');
  assert(worldJs.includes('checkObstacleCollision'), 'world.js implements checkObstacleCollision method');
  assert(worldJs.includes('crater_nw') && worldJs.includes('Crater Alpha'), 'world.js contains impact crater obstacles');

  // 9. Validate Rover Collision handling in rover.js
  const roverJs = fs.readFileSync(path.join(ROOT_DIR, 'assets/js/game/rover.js'), 'utf8');
  assert(roverJs.includes('checkObstacleCollision'), 'rover.js executes obstacle collision detection');
  assert(roverJs.includes('playBump'), 'rover.js triggers collision sound on obstacle contact');

  // 10. Validate Audio bump sound
  const audioJs = fs.readFileSync(path.join(ROOT_DIR, 'assets/js/game/audio.js'), 'utf8');
  assert(audioJs.includes('playBump'), 'audio.js includes synthesized playBump sound effect');

  // 11. Validate No Email in public content/portfolio/modals
  assert(!JSON.stringify(portfolio.socialLinks).includes('@'), 'portfolio.json does not contain email in socialLinks');
  const contentJs = fs.readFileSync(path.join(ROOT_DIR, 'assets/js/game/content.js'), 'utf8');
  assert(!contentJs.includes('mailto:'), 'content.js does not contain email addresses');

  // 12. Validate Victory Celebration in hud.js & particles.js
  const hudJs = fs.readFileSync(path.join(ROOT_DIR, 'assets/js/game/hud.js'), 'utf8');
  assert(hudJs.includes('openVictoryModal'), 'hud.js implements 100% victory celebration modal');
  assert(hudJs.includes('emitVictoryCelebration'), 'hud.js triggers particle victory fireworks');

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
