module.exports = {
  apps: [
    {
      name: "myapp",
      script: "dist/main.js", // or 'app.js' if not using TypeScript
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 3000, // Choose any port you like
      },
    },
  ],
};
