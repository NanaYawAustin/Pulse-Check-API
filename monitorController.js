const monitors = {};

function getSafeMonitor(monitor) {
  if (!monitor) return null;
  const { timer, ...safeMonitor } = monitor;
  return safeMonitor;
}

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
  if (!req.body) {
    return res.status(400).json({ message: "Request body is missing" });
  }

  const { id, timeout, alert_email } = req.body;

  // Validate required fields
  if (!id || !timeout) {
    return res.status(400).json({ message: "id and timeout are required" });
  }

  // Prevent duplicate monitors
  if (monitors[id]) {
    return res.status(400).json({ message: "Monitor already exists" });
  }

  // Validate timeout
  const parsedTimeout = Number(timeout);

  if (isNaN(parsedTimeout) || parsedTimeout <= 0) {
    return res.status(400).json({ message: "timeout must be a positive number" });
  }

  const now = Date.now();
  const readableNow = new Date(now).toLocaleString();

  const monitor = {
    id,
    timeout: parsedTimeout,
    alert_email,
    status: "active",
    previousHeartbeatAt: null,
    previousHeartbeatReadable: null,
    lastHeartbeatAt: now,
    lastHeartbeatReadable: readableNow,
    timer: setTimeout(() => triggerAlert(id), parsedTimeout * 1000),
  };

  monitors[id] = monitor;

  return res.status(201).json({
    message: "Monitor registered successfully",
    monitor: getSafeMonitor(monitor),
  });
}

// Heartbeat
function heartbeat(req, res) {
  const { id } = req.params;
  const monitor = monitors[id];

  if (!monitor) {
    return res.status(404).json({ message: "Monitor not found" });
  }

  if (monitor.status === "down") {
    return res.status(400).json({ message: "Monitor is down" });
  }

  // Resume if paused
  if (monitor.status === "paused") {
    monitor.status = "active";
  }

  if (monitor.timer) {
    clearTimeout(monitor.timer);
  }

  const now = Date.now();
  const readableNow = new Date(now).toLocaleString();

  monitor.previousHeartbeatAt = monitor.lastHeartbeatAt;
  monitor.previousHeartbeatReadable = monitor.lastHeartbeatReadable;
  monitor.lastHeartbeatAt = now;
  monitor.lastHeartbeatReadable = readableNow;
  monitor.timer = setTimeout(() => triggerAlert(id), monitor.timeout * 1000);

  return res.status(200).json({
    message: "Heartbeat received, timer reset",
    monitor: getSafeMonitor(monitor),
  });
}

// Pause monitor
function pauseMonitor(req, res) {
  const { id } = req.params;
  const monitor = monitors[id];

  if (!monitor) {
    return res.status(404).json({ message: "Monitor not found" });
  }

  if (monitor.status === "paused") {
    return res.status(400).json({ message: "Monitor already paused" });
  }

  if (monitor.status === "down") {
    return res.status(400).json({ message: "Cannot pause a down monitor" });
  }

  if (monitor.timer) {
    clearTimeout(monitor.timer);
  }

  monitor.status = "paused";

  return res.status(200).json({
    message: "Monitor paused successfully",
    monitor: getSafeMonitor(monitor),
  });
}

// List all monitors
function listMonitors(req, res) {
  return res.status(200).json({
    monitors: Object.values(monitors).map(getSafeMonitor),
  });
}

// Get single monitor
function getMonitor(req, res) {
  const { id } = req.params;
  const monitor = monitors[id];

  if (!monitor) {
    return res.status(404).json({ message: "Monitor not found" });
  }

  const { timer, ...safeMonitor } = monitor;

  return res.status(200).json({
    monitor: safeMonitor,
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
