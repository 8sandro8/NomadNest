const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'nomadnest.db');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.error("Error opening DB:", err.message);
        process.exit(1);
    }
});

db.get("SELECT count(*) as count FROM alojamientos", (err, row) => {
    if (err) {
        console.error("Error querying DB:", err.message);
        process.exit(1);
    }
    console.log(`Alojamientos count: ${row.count}`);
    if (row.count >= 3) {
        console.log("✅ CHECK PASSED: At least 3 alojamientos found.");
    } else {
        console.log("❌ CHECK FAILED: Found " + row.count + " alojamientos. Need at least 3.");
    }
});
