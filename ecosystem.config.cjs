module.exports = {
  apps: [
    {
      name: "frtp-site",
      script: "node_modules/next/dist/bin/next",
      args: "start -H 127.0.0.1 -p 3000",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: "3000"
      },
      max_memory_restart: "512M",
      time: true
    }
  ]
};
