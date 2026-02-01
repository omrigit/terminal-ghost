import type { LogLine } from '../components/Terminal/TerminalLine';
import { createLogLine, getTimestamp } from '../hooks/useLogEngine';

const images = [
  'node:18-alpine', 'python:3.11-slim', 'nginx:latest', 'redis:7', 'postgres:15',
  'mongo:6', 'mysql:8', 'ubuntu:22.04', 'alpine:3.18', 'golang:1.21',
  'rust:1.73', 'ruby:3.2', 'php:8.2-fpm', 'openjdk:17-slim', 'gradle:8-jdk17',
];

const containerNames = [
  'web-app', 'api-server', 'cache', 'db-primary', 'worker-1', 'proxy',
  'metrics', 'logs-collector', 'auth-service', 'gateway', 'scheduler',
];

const getRandomImage = () => images[Math.floor(Math.random() * images.length)];
const getRandomContainer = () => containerNames[Math.floor(Math.random() * containerNames.length)];
const getRandomHash = () => Math.random().toString(36).slice(2, 14);

const scenarios = [
  // docker build
  () => {
    const lines: LogLine[] = [];
    const steps = Math.floor(Math.random() * 10) + 5;
    
    lines.push(createLogLine(`$ docker build -t myapp:latest .`, 'accent', { prefix: '>' }));
    lines.push(createLogLine(`[+] Building ${(Math.random() * 30 + 5).toFixed(1)}s (${steps}/${steps})`, 'info'));
    
    for (let i = 1; i <= Math.min(steps, 6); i++) {
      const commands = [
        `FROM ${getRandomImage()}`,
        `WORKDIR /app`,
        `COPY package*.json ./`,
        `RUN npm install`,
        `COPY . .`,
        `RUN npm run build`,
        `EXPOSE 3000`,
        `CMD ["node", "dist/index.js"]`,
      ];
      const cmd = commands[Math.min(i - 1, commands.length - 1)];
      const cached = Math.random() > 0.5;
      lines.push(createLogLine(`=> [${i}/${steps}] ${cmd}${cached ? ' CACHED' : ''}`, cached ? 'dim' : 'default'));
    }
    
    lines.push(createLogLine(`=> exporting to image`, 'default'));
    lines.push(createLogLine(`=> => naming to docker.io/library/myapp:latest`, 'success'));
    
    return lines;
  },
  
  // docker pull
  () => {
    const lines: LogLine[] = [];
    const image = getRandomImage();
    
    lines.push(createLogLine(`$ docker pull ${image}`, 'accent', { prefix: '>' }));
    lines.push(createLogLine(`Using default tag: latest`, 'dim'));
    lines.push(createLogLine(`latest: Pulling from library/${image.split(':')[0]}`, 'default'));
    
    const layers = Math.floor(Math.random() * 5) + 3;
    for (let i = 0; i < layers; i++) {
      const hash = getRandomHash();
      const status = Math.random() > 0.3 ? 'Pull complete' : 'Already exists';
      lines.push(createLogLine(`${hash}: ${status}`, status === 'Already exists' ? 'dim' : 'default'));
    }
    
    lines.push(createLogLine(`Digest: sha256:${getRandomHash()}${getRandomHash()}`, 'dim'));
    lines.push(createLogLine(`Status: Downloaded newer image for ${image}`, 'success'));
    
    return lines;
  },
  
  // docker ps
  () => {
    const lines: LogLine[] = [];
    lines.push(createLogLine(`$ docker ps`, 'accent', { prefix: '>' }));
    lines.push(createLogLine(`CONTAINER ID   IMAGE                 STATUS          PORTS                    NAMES`, 'accent'));
    
    const count = Math.floor(Math.random() * 5) + 2;
    for (let i = 0; i < count; i++) {
      const id = getRandomHash().slice(0, 12);
      const image = getRandomImage();
      const mins = Math.floor(Math.random() * 60);
      const port = 3000 + Math.floor(Math.random() * 5000);
      const name = getRandomContainer();
      lines.push(createLogLine(`${id}   ${image.padEnd(20)}   Up ${mins} min     0.0.0.0:${port}->${port}/tcp   ${name}`, 'default'));
    }
    
    return lines;
  },
  
  // docker-compose up
  () => {
    const lines: LogLine[] = [];
    lines.push(createLogLine(`$ docker-compose up -d`, 'accent', { prefix: '>' }));
    
    const services = ['web', 'api', 'db', 'redis', 'nginx'];
    const activeServices = services.slice(0, Math.floor(Math.random() * 3) + 2);
    
    for (const service of activeServices) {
      lines.push(createLogLine(`[+] Running ${activeServices.length}/${activeServices.length}`, 'info'));
      lines.push(createLogLine(` ⠿ Container ${service}  Started`, 'success'));
    }
    
    return lines;
  },
  
  // docker logs
  () => {
    const lines: LogLine[] = [];
    const container = getRandomContainer();
    
    lines.push(createLogLine(`$ docker logs ${container} --tail 5`, 'accent', { prefix: '>' }));
    
    const logMessages = [
      `Server listening on port 3000`,
      `Connected to database`,
      `Cache initialized`,
      `Worker started with PID ${Math.floor(Math.random() * 10000)}`,
      `Health check passed`,
      `Received SIGTERM, graceful shutdown`,
      `Processing request from 192.168.1.${Math.floor(Math.random() * 255)}`,
    ];
    
    for (let i = 0; i < 5; i++) {
      const msg = logMessages[Math.floor(Math.random() * logMessages.length)];
      const type = msg.includes('Error') ? 'error' : msg.includes('Warning') ? 'warning' : 'dim';
      lines.push(createLogLine(`${getTimestamp()} ${msg}`, type));
    }
    
    return lines;
  },
  
  // docker images
  () => {
    const lines: LogLine[] = [];
    lines.push(createLogLine(`$ docker images`, 'accent', { prefix: '>' }));
    lines.push(createLogLine(`REPOSITORY          TAG       IMAGE ID       CREATED        SIZE`, 'accent'));
    
    const count = Math.floor(Math.random() * 6) + 3;
    for (let i = 0; i < count; i++) {
      const image = getRandomImage().split(':')[0];
      const tag = Math.random() > 0.5 ? 'latest' : getRandomImage().split(':')[1];
      const id = getRandomHash().slice(0, 12);
      const days = Math.floor(Math.random() * 30) + 1;
      const size = (Math.random() * 500 + 50).toFixed(0);
      lines.push(createLogLine(`${image.padEnd(18)} ${tag.padEnd(9)} ${id}   ${days} days ago    ${size}MB`, 'default'));
    }
    
    return lines;
  },
];

export const generateDockerLog = (): LogLine[] => {
  const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
  const lines = scenario();
  
  if (lines.length > 0) {
    lines[0].timestamp = getTimestamp();
  }
  
  return lines;
};
