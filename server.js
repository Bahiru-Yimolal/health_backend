const dotenv = require("dotenv");
dotenv.config({ path: "./src/config/.env" });
const app = require("./src/app");
const sequelize = require("./src/config/database");
const fs = require("fs");
const path = require("path");

// --- STARTUP KILL SWITCH CHECK ---
const stateFilePath = path.join(__dirname, ".sys_state");
if (fs.existsSync(stateFilePath)) {
  const sysState = fs.readFileSync(stateFilePath, "utf8").trim();
  if (sysState === "0") {
    console.error("CRITICAL: System is in LOCKED state. Exiting...");
    process.exit(1);
  }
}
// ---------------------------------

const PORT = process.env.PORT || 5000;

sequelize
  .sync({ alter: true })
  .then(async () => {
    console.log("Database synced successfully");

    // Sync Permissions from code configuration
    const syncPermissions = require("./src/utils/permissionSync");
    await syncPermissions();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    require("./src/utils/scherduler")
    // Dynamically import 'open' to avoid the ESM error
    // const { default: open } = await import("open");
    // open(`http://localhost:${PORT}/api/docs`);
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });
