// PM2 ecosystem for running the full GigKavach stack:
//   - ML Service  (Flask) on port 5000
//   - Backend     (Node)  on port 4000
//   - Frontend    (Vite)  on port 5173
module.exports = {
  apps: [
    {
      name: 'ml-service',
      cwd: '/home/user/webapp/ml-service',
      script: 'python3',
      args: '-u main.py',
      interpreter: 'none',
      env: {
        FLASK_ENV: 'production',
        PYTHONUNBUFFERED: '1',
        PORT: '5000'
      },
      max_restarts: 10,
      autorestart: true,
      out_file: '/home/user/webapp/logs/ml-out.log',
      error_file: '/home/user/webapp/logs/ml-err.log',
      merge_logs: true,
      time: true
    },
    {
      name: 'backend',
      cwd: '/home/user/webapp/backend',
      script: 'src/server.js',
      interpreter: 'node',
      env: {
        NODE_ENV: 'production',
        PORT: '4000',
        ML_SERVICE_URL: 'http://localhost:5000'
      },
      max_restarts: 10,
      autorestart: true,
      out_file: '/home/user/webapp/logs/backend-out.log',
      error_file: '/home/user/webapp/logs/backend-err.log',
      merge_logs: true,
      time: true
    },
    {
      name: 'frontend',
      cwd: '/home/user/webapp/gigshield-ui',
      script: 'npm',
      args: 'run dev -- --host 0.0.0.0 --port 5173',
      interpreter: 'none',
      env: {
        NODE_ENV: 'development'
      },
      max_restarts: 10,
      autorestart: true,
      out_file: '/home/user/webapp/logs/frontend-out.log',
      error_file: '/home/user/webapp/logs/frontend-err.log',
      merge_logs: true,
      time: true
    }
  ]
};
