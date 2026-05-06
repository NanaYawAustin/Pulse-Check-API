const monitors = {};

function triggerAlert(id) {
  const monitor = monitors[id];

  if (!monitor) {
    return;
  }

  monitor.status = "down";

  console.log({
    ALERT: `Device ${id} is down!`,
    time: Date.now(),
  });
}

function registerMonitor(req, res) {
  const { id, timeout, alert_email } = req.body;

  if (!id || timeout === undefined) {
    return res.status(400).json({ message: "id and timeout are required" });
  }

  const monitor = {
    id,
    timeout,
    alert_email,
    status: "active",
    lastHeartbeat: Date.now(),
    timer: setTimeout(() => triggerAlert(id), timeout * 1000),
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
