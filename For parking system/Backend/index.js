const express = require("express");
const client = require("prom-client"); // METRIC COLLECTION
const { doSomeHeavyTask } = require("./util");

const app = express();
const PORT = process.env.PORT || 8000;

// Collect default metrics from prom-client
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register }); // This starts collecting default metrics

// Default route
app.get("/", (req, res) => {
  return res.json({ message: "Hello from Express Server" });
});

// Simulate a slow endpoint
app.get("/slow", async (req, res) => {
  try {
    const timeTaken = await doSomeHeavyTask();
    return res.json({
      status: "Success",
      message: `Heavy task completed in ${timeTaken}ms`,
    });
  } catch (error) {
    console.error("Error occurred in /slow route:", error);
    return res
      .status(500)
      .json({ status: "Error", error: "Internal Server Error" });
  }
});

// Metrics route for Prometheus
app.get("/metrics", async (req, res) => {
  res.setHeader("Content-Type", client.register.contentType);
  const metrics = await client.register.metrics();
  res.send(metrics);
});

// Start server
app.listen(PORT, () =>
  console.log(`Express Server Started at http://localhost:${PORT}`)
);
