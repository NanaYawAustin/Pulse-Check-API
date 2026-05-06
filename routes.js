const express = require("express");
const {
  registerMonitor,
  heartbeat,
  pauseMonitor,
  listMonitors,
  getMonitor,
} = require("./monitorController");

const router = express.Router();

router.post("/monitors", registerMonitor);
router.post("/monitors/:id/heartbeat", heartbeat);
router.post("/monitors/:id/pause", pauseMonitor);
router.get("/monitors", listMonitors);
router.get("/monitors/:id", getMonitor);

module.exports = router;
