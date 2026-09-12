const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

console.log('[*] Upload scheduler loaded');

// প্রতি ১৫ মিনিটে চেক করো
cron.schedule('*/15 * * * *', () => {
  console.log('[*] Checking watch folder...');
  // এখানে আপলোড লজিক যোগ করো
});
