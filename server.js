const express = require('express');
const path = require('path');
const { DateTime } = require('luxon');

// NOTE: server-side wake disabled, client-side wake handled by Angular

const app = express();

app.use(express.static(path.join(__dirname, 'dist/portfolio/browser')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/portfolio/browser/index.html'));
});

// subdomains to ping
const subdomains = [
  "https://api.estate.erika-belicova.com/swagger-ui/index.html",
  "https://olympic-games.erika-belicova.com",
  "https://yoga.erika-belicova.com",
  "https://mdd.erika-belicova.com",
  "https://api-mdd.erika-belicova.com",
  "https://api-mdd.erika-belicova.com/swagger-ui/index.html",
];

// check if current time in Paris is between 8am and 5pm inclusive
function isBusinessHoursParis() {
  const nowParis = DateTime.now().setZone('Europe/Paris');
  const day = nowParis.weekday;

  // exclude weekends (Saturday = 6, Sunday = 7)
  if (day > 5) return false;

  const minutesSinceMidnight = nowParis.hour * 60 + nowParis.minute;
  const start = 9 * 60;  // 9:00 am
  const end = 16 * 60;   // 4:00 pm

  return minutesSinceMidnight >= start && minutesSinceMidnight <= end;
}

// ping all apps
async function wakeApps() {
  for (const url of subdomains) {
    try {
      await fetch(url);
    } catch (err) { }
  }
}

// ping every 20 minutes during Paris business hours
// commented out temporarily to limit dyno hours usage
// setInterval(() => {
//   if (isBusinessHoursParis()) {
//     wakeApps();
//   }
// }, 20 * 60 * 1000);

// immediate ping on server restart if business hours
// commented out temporarily to limit dyno hours usage
// if (isBusinessHoursParis()) {
//   wakeApps();
// }

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
