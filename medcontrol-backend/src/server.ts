import express from "express";
import cors from "cors";
import helmet from "helmet";
import router from "./routes";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { mobileConfig } from "./config/mobileConfig";

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(
  cors({
    origin: mobileConfig.corsOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use(express.json({ limit: mobileConfig.uploadLimits.json }));
app.use(
  express.urlencoded({
    extended: true,
    limit: mobileConfig.uploadLimits.urlencoded,
  })
);

app.use("/api", router);
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado em http://localhost:${PORT}/`);
});
