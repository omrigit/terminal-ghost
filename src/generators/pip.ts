import type { LogLine } from '../components/Terminal/TerminalLine';
import { createLogLine, getTimestamp } from '../hooks/useLogEngine';

const packages = [
  'numpy', 'pandas', 'scipy', 'matplotlib', 'tensorflow', 'pytorch', 'keras',
  'scikit-learn', 'requests', 'flask', 'django', 'fastapi', 'uvicorn', 'gunicorn',
  'pytest', 'black', 'flake8', 'mypy', 'pylint', 'isort', 'poetry', 'pipenv',
  'beautifulsoup4', 'selenium', 'scrapy', 'celery', 'redis', 'sqlalchemy',
  'alembic', 'pydantic', 'httpx', 'aiohttp', 'boto3', 'pillow', 'opencv-python',
  'transformers', 'torch', 'torchvision', 'huggingface-hub', 'openai', 'langchain',
  'streamlit', 'gradio', 'jupyter', 'notebook', 'ipython', 'rich', 'typer',
];

const versions = ['1.0.0', '2.3.1', '3.9.0', '4.1.2', '0.12.0', '23.1.0', '2024.1'];

const getRandomPackage = () => packages[Math.floor(Math.random() * packages.length)];
const getRandomVersion = () => versions[Math.floor(Math.random() * versions.length)];

const scenarios = [
  // pip install
  () => {
    const lines: LogLine[] = [];
    const pkg = getRandomPackage();
    const version = getRandomVersion();
    
    lines.push(createLogLine(`$ pip install ${pkg}`, 'accent', { prefix: '>' }));
    lines.push(createLogLine(`Collecting ${pkg}`, 'default'));
    lines.push(createLogLine(`  Downloading ${pkg}-${version}-py3-none-any.whl (${Math.floor(Math.random() * 500 + 50)} kB)`, 'dim'));
    
    // Random dependencies
    const deps = Math.floor(Math.random() * 5);
    for (let i = 0; i < deps; i++) {
      const dep = getRandomPackage();
      lines.push(createLogLine(`Collecting ${dep}`, 'default'));
      lines.push(createLogLine(`  Using cached ${dep}-${getRandomVersion()}-py3-none-any.whl`, 'dim'));
    }
    
    lines.push(createLogLine(`Installing collected packages: ${pkg}${deps > 0 ? ', ...' : ''}`, 'default'));
    lines.push(createLogLine(`Successfully installed ${pkg}-${version}`, 'success'));
    
    return lines;
  },
  
  // pip install -r requirements.txt
  () => {
    const lines: LogLine[] = [];
    lines.push(createLogLine(`$ pip install -r requirements.txt`, 'accent', { prefix: '>' }));
    
    const count = Math.floor(Math.random() * 10) + 5;
    for (let i = 0; i < count; i++) {
      const pkg = getRandomPackage();
      if (Math.random() > 0.7) {
        lines.push(createLogLine(`Requirement already satisfied: ${pkg} in ./venv/lib/python3.11/site-packages`, 'dim'));
      } else {
        lines.push(createLogLine(`Collecting ${pkg}`, 'default'));
        const progress = Math.floor(Math.random() * 100);
        if (progress < 100) {
          lines.push(createLogLine(`  Downloading ${pkg}...`, 'dim', { isProgress: true, progress }));
        }
      }
    }
    
    lines.push(createLogLine(`Successfully installed ${count} packages`, 'success'));
    
    return lines;
  },
  
  // pip upgrade
  () => {
    const lines: LogLine[] = [];
    const pkg = getRandomPackage();
    
    lines.push(createLogLine(`$ pip install --upgrade ${pkg}`, 'accent', { prefix: '>' }));
    lines.push(createLogLine(`Requirement already satisfied: ${pkg} in ./venv/lib/python3.11/site-packages (${getRandomVersion()})`, 'dim'));
    lines.push(createLogLine(`Collecting ${pkg}`, 'default'));
    lines.push(createLogLine(`  Downloading ${pkg}-${getRandomVersion()}-py3-none-any.whl`, 'dim'));
    lines.push(createLogLine(`Successfully installed ${pkg}-${getRandomVersion()}`, 'success'));
    
    return lines;
  },
  
  // pip list
  () => {
    const lines: LogLine[] = [];
    lines.push(createLogLine(`$ pip list`, 'accent', { prefix: '>' }));
    lines.push(createLogLine(`Package           Version`, 'accent'));
    lines.push(createLogLine(`----------------- --------`, 'dim'));
    
    for (let i = 0; i < Math.floor(Math.random() * 10) + 5; i++) {
      const pkg = getRandomPackage();
      const padding = ' '.repeat(Math.max(0, 18 - pkg.length));
      lines.push(createLogLine(`${pkg}${padding}${getRandomVersion()}`, 'default'));
    }
    
    return lines;
  },
  
  // pip freeze
  () => {
    const lines: LogLine[] = [];
    lines.push(createLogLine(`$ pip freeze > requirements.txt`, 'accent', { prefix: '>' }));
    
    const count = Math.floor(Math.random() * 15) + 5;
    lines.push(createLogLine(`Wrote ${count} packages to requirements.txt`, 'success'));
    
    return lines;
  },
  
  // pip with warning
  () => {
    const lines: LogLine[] = [];
    const pkg = getRandomPackage();
    
    lines.push(createLogLine(`$ pip install ${pkg}`, 'accent', { prefix: '>' }));
    lines.push(createLogLine(`DEPRECATION: Python 3.7 reached end-of-life`, 'warning'));
    lines.push(createLogLine(`Collecting ${pkg}`, 'default'));
    
    if (Math.random() > 0.5) {
      lines.push(createLogLine(`WARNING: ${getRandomPackage()} ${getRandomVersion()} does not provide the extra 'dev'`, 'warning'));
    }
    
    lines.push(createLogLine(`Successfully installed ${pkg}`, 'success'));
    
    return lines;
  },
];

export const generatePipLog = (): LogLine[] => {
  const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
  const lines = scenario();
  
  if (lines.length > 0) {
    lines[0].timestamp = getTimestamp();
  }
  
  return lines;
};
