import type { LogLine } from '../components/Terminal/TerminalLine';
import { createLogLine, getTimestamp } from '../hooks/useLogEngine';

const packages = [
  'react', 'react-dom', 'typescript', 'webpack', 'babel', 'eslint', 'prettier',
  'lodash', 'axios', 'express', 'next', 'vite', 'rollup', 'jest', 'mocha',
  'chai', 'moment', 'dayjs', 'uuid', 'chalk', 'commander', 'inquirer',
  '@types/node', '@types/react', 'tailwindcss', 'postcss', 'autoprefixer',
  'framer-motion', 'zustand', 'redux', 'mobx', 'graphql', 'apollo-client',
  'socket.io', 'mongoose', 'prisma', '@prisma/client', 'zod', 'yup',
  'react-query', 'swr', 'react-hook-form', 'formik', 'styled-components',
  '@emotion/react', 'sass', 'less', 'esbuild', 'turbo', 'nx', 'lerna',
];

const versions = ['1.0.0', '2.1.3', '3.0.0-beta.1', '4.2.1', '5.0.0', '18.2.0', '0.23.1', '7.3.2'];

const getRandomPackage = () => packages[Math.floor(Math.random() * packages.length)];
const getRandomVersion = () => versions[Math.floor(Math.random() * versions.length)];

const scenarios = [
  // Installing packages
  () => {
    const lines: LogLine[] = [];
    const pkg = getRandomPackage();
    const version = getRandomVersion();
    
    lines.push(createLogLine(`$ npm install ${pkg}@${version}`, 'accent', { prefix: '>' }));
    lines.push(createLogLine(`npm http fetch GET 200 https://registry.npmjs.org/${pkg}/-/${pkg}-${version}.tgz`, 'dim'));
    
    const deps = Math.floor(Math.random() * 50) + 10;
    lines.push(createLogLine(`added ${deps} packages in ${(Math.random() * 3 + 0.5).toFixed(1)}s`, 'success'));
    
    if (Math.random() > 0.7) {
      lines.push(createLogLine(`${Math.floor(Math.random() * 5) + 1} packages are looking for funding`, 'dim'));
      lines.push(createLogLine(`  run \`npm fund\` for details`, 'dim'));
    }
    
    return lines;
  },
  
  // npm audit
  () => {
    const lines: LogLine[] = [];
    lines.push(createLogLine(`$ npm audit`, 'accent', { prefix: '>' }));
    
    const vulnerabilities = Math.floor(Math.random() * 10);
    if (vulnerabilities === 0) {
      lines.push(createLogLine(`found 0 vulnerabilities`, 'success'));
    } else {
      const high = Math.floor(Math.random() * vulnerabilities);
      const moderate = vulnerabilities - high;
      lines.push(createLogLine(`found ${vulnerabilities} vulnerabilities (${moderate} moderate, ${high} high)`, vulnerabilities > 5 ? 'error' : 'warning'));
      lines.push(createLogLine(`  run \`npm audit fix\` to fix them`, 'dim'));
    }
    
    return lines;
  },
  
  // npm run build
  () => {
    const lines: LogLine[] = [];
    lines.push(createLogLine(`$ npm run build`, 'accent', { prefix: '>' }));
    lines.push(createLogLine(`> project@1.0.0 build`, 'dim'));
    lines.push(createLogLine(`> vite build`, 'dim'));
    lines.push(createLogLine('', 'default'));
    lines.push(createLogLine(`vite v5.0.0 building for production...`, 'info'));
    lines.push(createLogLine(`transforming...`, 'dim'));
    
    const chunks = Math.floor(Math.random() * 20) + 5;
    for (let i = 0; i < Math.min(chunks, 5); i++) {
      const size = (Math.random() * 100 + 10).toFixed(2);
      lines.push(createLogLine(`dist/assets/index-${Math.random().toString(36).slice(2, 10)}.js  ${size} kB │ gzip: ${(parseFloat(size) * 0.3).toFixed(2)} kB`, 'dim'));
    }
    
    lines.push(createLogLine(`✓ ${chunks} modules transformed.`, 'success'));
    lines.push(createLogLine(`✓ built in ${(Math.random() * 5 + 1).toFixed(2)}s`, 'success'));
    
    return lines;
  },
  
  // npm install with progress
  () => {
    const lines: LogLine[] = [];
    const pkg = getRandomPackage();
    
    lines.push(createLogLine(`$ npm install ${pkg}`, 'accent', { prefix: '>' }));
    lines.push(createLogLine(`npm WARN deprecated ${getRandomPackage()}@${getRandomVersion()}: This package is deprecated`, 'warning'));
    
    const progress = Math.floor(Math.random() * 40) + 60;
    lines.push(createLogLine(`Downloading ${pkg}...`, 'info', { isProgress: true, progress }));
    
    return lines;
  },
  
  // npm ls
  () => {
    const lines: LogLine[] = [];
    lines.push(createLogLine(`$ npm ls --depth=0`, 'accent', { prefix: '>' }));
    lines.push(createLogLine(`project@1.0.0 /Users/dev/project`, 'default'));
    
    for (let i = 0; i < Math.floor(Math.random() * 8) + 3; i++) {
      const isLast = i === Math.floor(Math.random() * 8) + 2;
      const prefix = isLast ? '└──' : '├──';
      lines.push(createLogLine(`${prefix} ${getRandomPackage()}@${getRandomVersion()}`, 'dim'));
    }
    
    return lines;
  },
  
  // npm ci
  () => {
    const lines: LogLine[] = [];
    lines.push(createLogLine(`$ npm ci`, 'accent', { prefix: '>' }));
    lines.push(createLogLine(`npm WARN deprecated ${getRandomPackage()}@${getRandomVersion()}: Please upgrade`, 'warning'));
    
    const packages = Math.floor(Math.random() * 500) + 200;
    lines.push(createLogLine(`added ${packages} packages in ${(Math.random() * 30 + 5).toFixed(1)}s`, 'success'));
    
    return lines;
  },
];

export const generateNpmLog = (): LogLine[] => {
  const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
  const lines = scenario();
  
  // Add timestamp to first line
  if (lines.length > 0) {
    lines[0].timestamp = getTimestamp();
  }
  
  return lines;
};
