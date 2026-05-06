const monitors = {};

// Trigger alert
function triggerAlert(id) {
  const monitor = monitors[id];

  if (!monitor) return;

  monitor.status = "down";

  console.log({
    ALERT: `Device ${id} is down!`,
    time: Date.now(),
  });
}

// Register Monitor
function registerMonitor(req, res) {
  const { id, timeout, alert_email } = req.body;

  // Validate required fields
  if (!id || timeout === undefined) {
    return res.status(400).json({ message: "id and timeout are required" });
  }

  //  Prevent duplicate monitors
  if (monitors[id]) {
    return res.status(400).json({ message: "Monitor already exists" });
  }

  //  Validate timeout type
  const parsedTimeout = Number(timeout);

  if (isNaN(parsedTimeout) || parsedTimeout <= 0) {
    return res.status(400).json({ message: "timeout must be a positive number" });
  }

  const monitor = {
    id,
    timeout: parsedTimeout,
    alert_email,
    status: "active",
    lastHeartbeat: Date.now(),
    timer: setTimeout(() => triggerAlert(id), parsedTimeout * 1000),
  };

  monitors[id] = monitor;

  return res.status(201).json({
    message: "Monitor registered successfully",
    monitor,
  });
}

function heartbeat(req, res) {
  const { id } = req.params;
  const monitor = monitors[id];

  if (!monitor) {
    return res.status(404).json({ message: "Monitor not found" });
  }

  if (monitor.status === "down") {
    return res.status(400).json({ message: "Monitor is down" });
  }

  clearTimeout(monitor.timer);
  monitor.status = "active";
  monitor.lastHeartbeat = Date.now();
  monitor.timer = setTimeout(() => triggerAlert(id), monitor.timeout * 1000);

  return res.status(200).json({
    message: "Heartbeat received, timer reset",
    monitor,
  });
}

function pauseMonitor(req, res) {
  const { id } = req.params;
  const monitor = monitors[id];

  if (!monitor) {
    return res.status(404).json({ message: "Monitor not found" });
  }

  clearTimeout(monitor.timer);
  monitor.status = "paused";

  return res.status(200).json({
    message: "Monitor paused successfully",
    monitor,
  });
}

function listMonitors(req, res) {
  return res.status(200).json({
    monitors: Object.values(monitors),
  });
}

function getMonitor(req, res) {
  const { id } = req.params;
  const monitor = monitors[id];

  if (!monitor) {
    return res.status(404).json({ message: "Monitor not found" });
  }

  return res.status(200).json({
    monitor,
  });
}

module.exports = {
  registerMonitor,
  heartbeat,
  pauseMonitor,
  listMonitors,
  getMonitor,
  triggerAlert,
  monitors,
};