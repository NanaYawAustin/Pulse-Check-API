const monitors = {};

function triggerAlert(id) {
  const monitor = monitors[id];

  if (!monitor) return;

  monitor.status = "down";

  console.log({
    ALERT: `Device ${id} is down!`,
    time: Date.now(),
  });
}

function registerMonitor(req, res) {
  const { id, timeout, alert_email } = req.body;

  // 1. Validate required fields
  if (!id || timeout === undefined) {
    return res.status(400).json({ message: "id and timeout are required" });
  }

  // 2. Prevent duplicate monitors
  if (monitors[id]) {
    return res.status(400).json({ message: "Monitor already exists" });
  }

  // 3. Validate timeout type
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

module.exports = {
  registerMonitor,
  triggerAlert,
  monitors,
};