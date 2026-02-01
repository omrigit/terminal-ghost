import type { LogLine } from '../components/Terminal/TerminalLine';
import { createLogLine, getTimestamp } from '../hooks/useLogEngine';

const endpoints = [
  '/api/users', '/api/auth/login', '/api/products', '/api/orders', '/api/health',
  '/api/v2/data', '/api/search', '/api/webhook', '/graphql', '/api/upload',
  '/api/payments', '/api/notifications', '/api/analytics', '/api/settings',
];

const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
const userAgents = ['Mozilla/5.0', 'PostmanRuntime/7.32', 'axios/1.4.0', 'curl/8.1.2'];

const getRandomEndpoint = () => endpoints[Math.floor(Math.random() * endpoints.length)];
const getRandomMethod = () => methods[Math.floor(Math.random() * methods.length)];
const getRandomStatus = () => {
  const rand = Math.random();
  if (rand < 0.7) return [200, 201, 204][Math.floor(Math.random() * 3)];
  if (rand < 0.9) return [400, 401, 404][Math.floor(Math.random() * 3)];
  return [500, 502, 503][Math.floor(Math.random() * 3)];
};
const getRandomIP = () => `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

const scenarios = [
  // HTTP access logs (nginx style)
  () => {
    const lines: LogLine[] = [];
    const count = Math.floor(Math.random() * 5) + 2;
    
    for (let i = 0; i < count; i++) {
      const ip = getRandomIP();
      const method = getRandomMethod();
      const endpoint = getRandomEndpoint();
      const status = getRandomStatus();
      const bytes = Math.floor(Math.random() * 50000) + 100;
      const time = (Math.random() * 500 + 10).toFixed(0);
      
      let type: 'default' | 'success' | 'warning' | 'error' = 'default';
      if (status >= 200 && status < 300) type = 'success';
      else if (status >= 400 && status < 500) type = 'warning';
      else if (status >= 500) type = 'error';
      
      lines.push(createLogLine(
        `${ip} - - [${getTimestamp()}] "${method} ${endpoint} HTTP/1.1" ${status} ${bytes} "-" "${userAgents[Math.floor(Math.random() * userAgents.length)]}" ${time}ms`,
        type
      ));
    }
    
    return lines;
  },
  
  // Express.js style logs
  () => {
    const lines: LogLine[] = [];
    const count = Math.floor(Math.random() * 4) + 2;
    
    for (let i = 0; i < count; i++) {
      const method = getRandomMethod();
      const endpoint = getRandomEndpoint();
      const status = getRandomStatus();
      const time = (Math.random() * 200 + 5).toFixed(0);
      
      let color = 'success';
      if (status >= 400 && status < 500) color = 'warning';
      else if (status >= 500) color = 'error';
      
      lines.push(createLogLine(
        `${method} ${endpoint} ${status} ${time}ms`,
        color as 'success' | 'warning' | 'error',
        { prefix: `[${getTimestamp()}]` }
      ));
    }
    
    return lines;
  },
  
  // Server startup
  () => {
    const lines: LogLine[] = [];
    const port = [3000, 8080, 5000, 4000][Math.floor(Math.random() * 4)];
    
    lines.push(createLogLine(`[${getTimestamp()}] Starting server...`, 'info'));
    lines.push(createLogLine(`[${getTimestamp()}] Loading configuration from .env`, 'dim'));
    lines.push(createLogLine(`[${getTimestamp()}] Database connection established`, 'success'));
    lines.push(createLogLine(`[${getTimestamp()}] Redis cache connected`, 'success'));
    lines.push(createLogLine(`[${getTimestamp()}] Registering routes...`, 'dim'));
    lines.push(createLogLine(`[${getTimestamp()}] ✓ Server listening on http://localhost:${port}`, 'success', { glow: true }));
    
    return lines;
  },
  
  // WebSocket events
  () => {
    const lines: LogLine[] = [];
    const actions = ['connected', 'disconnected', 'message received', 'broadcast sent', 'room joined'];
    const users = ['user_' + Math.random().toString(36).slice(2, 8)];
    
    lines.push(createLogLine(`[WS] Client ${users[0]} ${actions[Math.floor(Math.random() * actions.length)]}`, 'info'));
    
    if (Math.random() > 0.5) {
      lines.push(createLogLine(`[WS] Active connections: ${Math.floor(Math.random() * 100) + 10}`, 'dim'));
    }
    
    return lines;
  },
  
  // GraphQL operations
  () => {
    const lines: LogLine[] = [];
    const operations = ['Query.getUser', 'Mutation.createPost', 'Query.listProducts', 'Subscription.onMessage'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    const time = (Math.random() * 100 + 5).toFixed(0);
    
    lines.push(createLogLine(`[GraphQL] ${operation} completed in ${time}ms`, 'info'));
    
    if (Math.random() > 0.8) {
      lines.push(createLogLine(`[GraphQL] Cache HIT for ${operation}`, 'dim'));
    }
    
    return lines;
  },
  
  // Rate limiting
  () => {
    const lines: LogLine[] = [];
    const ip = getRandomIP();
    
    if (Math.random() > 0.5) {
      lines.push(createLogLine(`[RateLimit] Request allowed for ${ip} (${Math.floor(Math.random() * 50) + 50}/100 remaining)`, 'dim'));
    } else {
      lines.push(createLogLine(`[RateLimit] Rate limit exceeded for ${ip}`, 'warning'));
      lines.push(createLogLine(`[RateLimit] Retry after 60 seconds`, 'warning'));
    }
    
    return lines;
  },
  
  // Health checks
  () => {
    const lines: LogLine[] = [];
    const services = ['database', 'cache', 'queue', 'storage', 'auth-service'];
    
    lines.push(createLogLine(`[Health] Running health checks...`, 'info'));
    
    for (const service of services.slice(0, Math.floor(Math.random() * 3) + 2)) {
      const healthy = Math.random() > 0.1;
      const latency = (Math.random() * 50 + 5).toFixed(0);
      
      if (healthy) {
        lines.push(createLogLine(`[Health] ✓ ${service}: healthy (${latency}ms)`, 'success'));
      } else {
        lines.push(createLogLine(`[Health] ✗ ${service}: unhealthy (timeout)`, 'error'));
      }
    }
    
    return lines;
  },
  
  // Background job processing
  () => {
    const lines: LogLine[] = [];
    const jobs = ['SendEmailJob', 'ProcessPaymentJob', 'GenerateReportJob', 'SyncDataJob', 'CleanupJob'];
    const job = jobs[Math.floor(Math.random() * jobs.length)];
    const jobId = Math.random().toString(36).slice(2, 10);
    
    lines.push(createLogLine(`[Worker] Processing job ${job}#${jobId}`, 'info'));
    lines.push(createLogLine(`[Worker] Job ${job}#${jobId} completed in ${(Math.random() * 5000 + 100).toFixed(0)}ms`, 'success'));
    
    if (Math.random() > 0.7) {
      lines.push(createLogLine(`[Worker] Queue depth: ${Math.floor(Math.random() * 50)} jobs pending`, 'dim'));
    }
    
    return lines;
  },
];

export const generateServerLog = (): LogLine[] => {
  const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
  const lines = scenario();
  
  if (lines.length > 0 && !lines[0].timestamp) {
    lines[0].timestamp = getTimestamp();
  }
  
  return lines;
};
