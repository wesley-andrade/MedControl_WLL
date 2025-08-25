export const mobileConfig = {
  corsOrigins: [
    "http://localhost:3000",
    "http://localhost:8080",
    "http://192.168.1.11:3000",
    "http://192.168.1.11:8080",
    "exp://192.168.1.11:8081",
    "exp://192.168.1.11:8082",

    "http://10.0.2.2:3000",
    "http://10.0.2.2:8080",
    "exp://10.0.2.2:8081",
    "exp://10.0.2.2:8082",
  ],

  securityHeaders: {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  },

  uploadLimits: {
    json: "10mb",
    urlencoded: "10mb",
    fileSize: "5mb",
  },

  timeouts: {
    request: 30000,
    response: 30000,
    keepAlive: 5000,
  },

  cache: {
    maxAge: 300,
    etag: true,
    lastModified: true,
  },
};
