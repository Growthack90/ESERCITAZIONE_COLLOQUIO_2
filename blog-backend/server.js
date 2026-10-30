import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";

const port = process.env.PORT || 3000;

try {
  await connectDB();
  app.listen(port, () => {
    console.log(`Blog backend listening on port ${port}`);
  });
} catch (error) {
  console.error("Failed to start the blog backend:", error);
  process.exitCode = 1;
}
