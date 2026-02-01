import type { LogLine } from '../components/Terminal/TerminalLine';
import { createLogLine, getTimestamp } from '../hooks/useLogEngine';

const branches = ['main', 'develop', 'feature/auth', 'feature/api', 'bugfix/login', 'release/v2.0', 'hotfix/security'];
const files = [
  'src/index.ts', 'src/App.tsx', 'package.json', 'README.md', 'src/utils/api.ts',
  'src/components/Header.tsx', 'src/hooks/useAuth.ts', '.env', 'docker-compose.yml',
  'src/styles/main.css', 'tests/unit/app.test.ts', 'src/services/user.service.ts',
];

const commitMessages = [
  'feat: add user authentication',
  'fix: resolve memory leak in worker',
  'docs: update API documentation',
  'refactor: simplify data processing logic',
  'chore: update dependencies',
  'style: format code with prettier',
  'test: add unit tests for auth module',
  'perf: optimize database queries',
  'ci: update GitHub Actions workflow',
  'feat: implement dark mode toggle',
];

const getRandomBranch = () => branches[Math.floor(Math.random() * branches.length)];
const getRandomFile = () => files[Math.floor(Math.random() * files.length)];
const getRandomCommit = () => commitMessages[Math.floor(Math.random() * commitMessages.length)];
const getRandomHash = () => Math.random().toString(36).slice(2, 9);

const scenarios = [
  // git status
  () => {
    const lines: LogLine[] = [];
    const branch = getRandomBranch();
    
    lines.push(createLogLine(`$ git status`, 'accent', { prefix: '>' }));
    lines.push(createLogLine(`On branch ${branch}`, 'default'));
    
    if (Math.random() > 0.5) {
      lines.push(createLogLine(`Your branch is ahead of 'origin/${branch}' by ${Math.floor(Math.random() * 5) + 1} commit(s).`, 'info'));
    }
    
    const modified = Math.floor(Math.random() * 4);
    const untracked = Math.floor(Math.random() * 3);
    
    if (modified > 0) {
      lines.push(createLogLine(`Changes not staged for commit:`, 'warning'));
      for (let i = 0; i < modified; i++) {
        lines.push(createLogLine(`        modified:   ${getRandomFile()}`, 'error'));
      }
    }
    
    if (untracked > 0) {
      lines.push(createLogLine(`Untracked files:`, 'warning'));
      for (let i = 0; i < untracked; i++) {
        lines.push(createLogLine(`        ${getRandomFile()}`, 'error'));
      }
    }
    
    if (modified === 0 && untracked === 0) {
      lines.push(createLogLine(`nothing to commit, working tree clean`, 'success'));
    }
    
    return lines;
  },
  
  // git log
  () => {
    const lines: LogLine[] = [];
    lines.push(createLogLine(`$ git log --oneline -5`, 'accent', { prefix: '>' }));
    
    for (let i = 0; i < 5; i++) {
      const hash = getRandomHash();
      const msg = getRandomCommit();
      lines.push(createLogLine(`${hash} ${msg}`, i === 0 ? 'accent' : 'default'));
    }
    
    return lines;
  },
  
  // git pull
  () => {
    const lines: LogLine[] = [];
    const branch = getRandomBranch();
    
    lines.push(createLogLine(`$ git pull origin ${branch}`, 'accent', { prefix: '>' }));
    lines.push(createLogLine(`remote: Enumerating objects: ${Math.floor(Math.random() * 50) + 10}, done.`, 'dim'));
    lines.push(createLogLine(`remote: Counting objects: 100% (${Math.floor(Math.random() * 30) + 5}/${Math.floor(Math.random() * 30) + 5}), done.`, 'dim'));
    lines.push(createLogLine(`remote: Compressing objects: 100% (${Math.floor(Math.random() * 20) + 3}/${Math.floor(Math.random() * 20) + 3}), done.`, 'dim'));
    
    const files = Math.floor(Math.random() * 10) + 1;
    const insertions = Math.floor(Math.random() * 200) + 10;
    const deletions = Math.floor(Math.random() * 50);
    
    lines.push(createLogLine(`From github.com:user/repo`, 'default'));
    lines.push(createLogLine(` * branch            ${branch} -> FETCH_HEAD`, 'default'));
    lines.push(createLogLine(`Updating ${getRandomHash()}..${getRandomHash()}`, 'default'));
    lines.push(createLogLine(`Fast-forward`, 'success'));
    lines.push(createLogLine(` ${files} file${files > 1 ? 's' : ''} changed, ${insertions} insertion${insertions > 1 ? 's' : ''}(+), ${deletions} deletion${deletions > 1 ? 's' : ''}(-)`, 'success'));
    
    return lines;
  },
  
  // git commit
  () => {
    const lines: LogLine[] = [];
    const msg = getRandomCommit();
    
    lines.push(createLogLine(`$ git commit -m "${msg}"`, 'accent', { prefix: '>' }));
    lines.push(createLogLine(`[${getRandomBranch()} ${getRandomHash()}] ${msg}`, 'success'));
    
    const files = Math.floor(Math.random() * 5) + 1;
    const insertions = Math.floor(Math.random() * 100) + 5;
    const deletions = Math.floor(Math.random() * 30);
    
    lines.push(createLogLine(` ${files} file${files > 1 ? 's' : ''} changed, ${insertions} insertion${insertions > 1 ? 's' : ''}(+), ${deletions} deletion${deletions > 1 ? 's' : ''}(-)`, 'default'));
    
    return lines;
  },
  
  // git push
  () => {
    const lines: LogLine[] = [];
    const branch = getRandomBranch();
    
    lines.push(createLogLine(`$ git push origin ${branch}`, 'accent', { prefix: '>' }));
    lines.push(createLogLine(`Enumerating objects: ${Math.floor(Math.random() * 20) + 5}, done.`, 'dim'));
    lines.push(createLogLine(`Counting objects: 100% (${Math.floor(Math.random() * 15) + 3}/${Math.floor(Math.random() * 15) + 3}), done.`, 'dim'));
    lines.push(createLogLine(`Delta compression using up to 8 threads`, 'dim'));
    lines.push(createLogLine(`Compressing objects: 100% (${Math.floor(Math.random() * 10) + 2}/${Math.floor(Math.random() * 10) + 2}), done.`, 'dim'));
    lines.push(createLogLine(`Writing objects: 100% (${Math.floor(Math.random() * 8) + 2}/${Math.floor(Math.random() * 8) + 2}), ${(Math.random() * 10 + 1).toFixed(2)} KiB | ${(Math.random() * 5 + 1).toFixed(2)} MiB/s, done.`, 'dim'));
    lines.push(createLogLine(`To github.com:user/repo.git`, 'default'));
    lines.push(createLogLine(`   ${getRandomHash()}..${getRandomHash()}  ${branch} -> ${branch}`, 'success'));
    
    return lines;
  },
  
  // git diff
  () => {
    const lines: LogLine[] = [];
    const file = getRandomFile();
    
    lines.push(createLogLine(`$ git diff ${file}`, 'accent', { prefix: '>' }));
    lines.push(createLogLine(`diff --git a/${file} b/${file}`, 'info'));
    lines.push(createLogLine(`index ${getRandomHash()}..${getRandomHash()} 100644`, 'dim'));
    lines.push(createLogLine(`--- a/${file}`, 'error'));
    lines.push(createLogLine(`+++ b/${file}`, 'success'));
    lines.push(createLogLine(`@@ -${Math.floor(Math.random() * 20) + 1},${Math.floor(Math.random() * 10) + 3} +${Math.floor(Math.random() * 20) + 1},${Math.floor(Math.random() * 10) + 3} @@`, 'info'));
    lines.push(createLogLine(`-  const oldValue = "deprecated";`, 'error'));
    lines.push(createLogLine(`+  const newValue = "updated";`, 'success'));
    
    return lines;
  },
  
  // git branch
  () => {
    const lines: LogLine[] = [];
    lines.push(createLogLine(`$ git branch -a`, 'accent', { prefix: '>' }));
    
    const currentBranch = getRandomBranch();
    for (const branch of branches.slice(0, Math.floor(Math.random() * 4) + 3)) {
      if (branch === currentBranch) {
        lines.push(createLogLine(`* ${branch}`, 'success'));
      } else {
        lines.push(createLogLine(`  ${branch}`, 'default'));
      }
    }
    
    lines.push(createLogLine(`  remotes/origin/main`, 'dim'));
    lines.push(createLogLine(`  remotes/origin/${currentBranch}`, 'dim'));
    
    return lines;
  },
];

export const generateGitLog = (): LogLine[] => {
  const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
  const lines = scenario();
  
  if (lines.length > 0) {
    lines[0].timestamp = getTimestamp();
  }
  
  return lines;
};
