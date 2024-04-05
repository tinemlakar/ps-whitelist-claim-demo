module.exports = {
  apps: [
    {
      name: 'http-server',
      script: './dist/scripts/start-http.js',
      restart_delay: 3000,
    },
  ],
};
