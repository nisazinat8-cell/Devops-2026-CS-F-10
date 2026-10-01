const test = require("node:test");
const assert = require("node:assert");
const http = require("node:http");
const { app } = require("../server");

// Helper to make local HTTP requests to the Express app
function makeRequest({ method = "GET", path = "/", body = null, headers = {} }) {
  return new Promise((resolve, reject) => {
    const server = http.createServer(app);
    server.listen(0, "127.0.0.1", () => {
      const port = server.address().port;
      const payload = body ? JSON.stringify(body) : null;
      const reqHeaders = { ...headers };

      if (payload) {
        reqHeaders["Content-Type"] = "application/json";
        reqHeaders["Content-Length"] = Buffer.byteLength(payload);
      }

      const req = http.request(
        {
          host: "127.0.0.1",
          port,
          path,
          method,
          headers: reqHeaders,
        },
        (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => {
            server.close();
            try {
              const json = JSON.parse(data);
              resolve({ status: res.statusCode, headers: res.headers, body: json, raw: data });
            } catch {
              resolve({ status: res.statusCode, headers: res.headers, body: null, raw: data });
            }
          });
        }
      );

      req.on("error", (err) => {
        server.close();
        reject(err);
      });

      if (payload) {
        req.write(payload);
      }
      req.end();
    });
  });
}

test("CareerConnect Backend API Tests", async (t) => {
  await t.test("GET /api/health returns 200 and healthy status", async () => {
    const res = await makeRequest({ path: "/api/health" });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.status, "healthy");
  });

  await t.test("GET /api/jobs returns opportunity list", async () => {
    const res = await makeRequest({ path: "/api/jobs" });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.jobs));
    assert.ok(res.body.jobs.length > 0);
  });

  await t.test("GET /api/jobs?search=python filters matching jobs", async () => {
    const res = await makeRequest({ path: "/api/jobs?search=python" });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.jobs));
  });

  await t.test("POST /api/auth/register with empty body returns 400", async () => {
    const res = await makeRequest({ method: "POST", path: "/api/auth/register", body: {} });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
  });

  await t.test("POST /api/auth/login with invalid email returns 400", async () => {
    const res = await makeRequest({
      method: "POST",
      path: "/api/auth/login",
      body: { email: "notanemail", password: "short" },
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
  });

  await t.test("POST /api/auth/login with valid format returns token", async () => {
    const res = await makeRequest({
      method: "POST",
      path: "/api/auth/login",
      body: { email: "student@skit.ac.in", password: "password123" },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(typeof res.body.token === "string");
  });

  await t.test("GET /api/metrics returns prometheus formatted text", async () => {
    const res = await makeRequest({ path: "/api/metrics" });
    assert.strictEqual(res.status, 200);
    assert.ok(res.raw.includes("careerconnect_requests_total"));
    assert.ok(res.raw.includes("careerconnect_uptime_seconds"));
  });
});
