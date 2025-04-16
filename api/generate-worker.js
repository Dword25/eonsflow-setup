const fs = require("fs");
const path = require("path");

module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    let body = "";
    await new Promise((resolve) => {
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", resolve);
    });

    const { webAppUrl } = JSON.parse(body);

    if (!webAppUrl) {
      return res.status(400).json({ error: "Missing webAppUrl" });
    }

    // 💡 환경변수 사용 예시
    const BASE_SCRIPT_URL = process.env.BASE_SCRIPT_URL || "https://your-default-url.com";

    const templatePath = path.join(process.cwd(), "template.html");
    const template = fs.readFileSync(templatePath, "utf8");

    const result = template
      .replace(/{{WEB_APP_URL}}/g, webAppUrl)
      .replace(/{{BASE_SCRIPT_URL}}/g, BASE_SCRIPT_URL);

    res.setHeader("Content-disposition", "attachment; filename=index.html");
    res.setHeader("Content-Type", "text/html");
    res.status(200).send(result);
  } catch (err) {
    console.error("[ERROR]", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
