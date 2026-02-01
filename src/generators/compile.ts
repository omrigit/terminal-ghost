import type { LogLine } from '../components/Terminal/TerminalLine';
import { createLogLine, getTimestamp } from '../hooks/useLogEngine';

const scenarios = [
  // Rust/Cargo build
  () => {
    const lines: LogLine[] = [];
    const crates = ['serde', 'tokio', 'reqwest', 'clap', 'anyhow', 'thiserror', 'axum', 'sqlx'];
    
    lines.push(createLogLine(`$ cargo build --release`, 'accent', { prefix: '>' }));
    
    const count = Math.floor(Math.random() * 5) + 3;
    for (let i = 0; i < count; i++) {
      const crate = crates[Math.floor(Math.random() * crates.length)];
      const version = `${Math.floor(Math.random() * 2)}.${Math.floor(Math.random() * 30)}.${Math.floor(Math.random() * 10)}`;
      lines.push(createLogLine(`   Compiling ${crate} v${version}`, 'default'));
    }
    
    if (Math.random() > 0.8) {
      lines.push(createLogLine(`warning: unused variable: \`temp\``, 'warning'));
      lines.push(createLogLine(`  --> src/main.rs:42:9`, 'dim'));
    }
    
    lines.push(createLogLine(`   Compiling myproject v0.1.0 (/home/user/project)`, 'default'));
    lines.push(createLogLine(`    Finished release [optimized] target(s) in ${(Math.random() * 30 + 5).toFixed(2)}s`, 'success'));
    
    return lines;
  },
  
  // Go build
  () => {
    const lines: LogLine[] = [];
    const packages = ['github.com/gin-gonic/gin', 'github.com/gorilla/mux', 'go.uber.org/zap', 'github.com/spf13/cobra'];
    
    lines.push(createLogLine(`$ go build -o app ./cmd/server`, 'accent', { prefix: '>' }));
    
    if (Math.random() > 0.6) {
      lines.push(createLogLine(`go: downloading ${packages[Math.floor(Math.random() * packages.length)]}`, 'dim'));
    }
    
    lines.push(createLogLine(``, 'default'));
    
    return lines;
  },
  
  // Webpack
  () => {
    const lines: LogLine[] = [];
    
    lines.push(createLogLine(`$ webpack --mode production`, 'accent', { prefix: '>' }));
    lines.push(createLogLine(`asset main.${Math.random().toString(36).slice(2, 10)}.js ${(Math.random() * 500 + 100).toFixed(2)} KiB [emitted] [minimized] (name: main)`, 'default'));
    lines.push(createLogLine(`asset vendors.${Math.random().toString(36).slice(2, 10)}.js ${(Math.random() * 300 + 50).toFixed(2)} KiB [emitted] [minimized] (name: vendors)`, 'default'));
    lines.push(createLogLine(`asset index.html 1.2 KiB [emitted]`, 'dim'));
    
    const modules = Math.floor(Math.random() * 200) + 50;
    lines.push(createLogLine(`webpack ${Math.floor(Math.random() * 3) + 5}.${Math.floor(Math.random() * 90)}.0 compiled successfully in ${Math.floor(Math.random() * 10000) + 2000} ms`, 'success'));
    lines.push(createLogLine(`${modules} modules`, 'dim'));
    
    return lines;
  },
  
  // TypeScript
  () => {
    const lines: LogLine[] = [];
    
    lines.push(createLogLine(`$ tsc --build`, 'accent', { prefix: '>' }));
    
    if (Math.random() > 0.7) {
      const file = `src/${['utils', 'components', 'services'][Math.floor(Math.random() * 3)]}/index.ts`;
      const line = Math.floor(Math.random() * 100) + 1;
      lines.push(createLogLine(`${file}:${line}:${Math.floor(Math.random() * 30) + 1} - error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.`, 'error'));
      lines.push(createLogLine(`Found 1 error.`, 'error'));
    } else {
      lines.push(createLogLine(`Successfully compiled ${Math.floor(Math.random() * 50) + 10} files.`, 'success'));
    }
    
    return lines;
  },
  
  // GCC/C++
  () => {
    const lines: LogLine[] = [];
    const files = ['main.cpp', 'utils.cpp', 'parser.cpp', 'network.cpp'];
    
    lines.push(createLogLine(`$ make all`, 'accent', { prefix: '>' }));
    
    for (const file of files.slice(0, Math.floor(Math.random() * 3) + 2)) {
      lines.push(createLogLine(`g++ -O3 -Wall -c ${file} -o ${file.replace('.cpp', '.o')}`, 'dim'));
    }
    
    if (Math.random() > 0.8) {
      lines.push(createLogLine(`main.cpp:42:15: warning: comparison of integer expressions of different signedness`, 'warning'));
    }
    
    lines.push(createLogLine(`g++ -o app main.o utils.o -lpthread`, 'default'));
    lines.push(createLogLine(`Build complete.`, 'success'));
    
    return lines;
  },
  
  // Maven
  () => {
    const lines: LogLine[] = [];
    
    lines.push(createLogLine(`$ mvn clean package`, 'accent', { prefix: '>' }));
    lines.push(createLogLine(`[INFO] Scanning for projects...`, 'dim'));
    lines.push(createLogLine(`[INFO] `, 'default'));
    lines.push(createLogLine(`[INFO] --- maven-clean-plugin:3.2.0:clean (default-clean) @ myapp ---`, 'default'));
    lines.push(createLogLine(`[INFO] Deleting /home/user/project/target`, 'dim'));
    lines.push(createLogLine(`[INFO] `, 'default'));
    lines.push(createLogLine(`[INFO] --- maven-compiler-plugin:3.11.0:compile (default-compile) @ myapp ---`, 'default'));
    lines.push(createLogLine(`[INFO] Compiling ${Math.floor(Math.random() * 50) + 20} source files to /home/user/project/target/classes`, 'default'));
    lines.push(createLogLine(`[INFO] `, 'default'));
    lines.push(createLogLine(`[INFO] BUILD SUCCESS`, 'success', { glow: true }));
    lines.push(createLogLine(`[INFO] Total time:  ${(Math.random() * 30 + 5).toFixed(3)} s`, 'dim'));
    
    return lines;
  },
  
  // Gradle
  () => {
    const lines: LogLine[] = [];
    
    lines.push(createLogLine(`$ ./gradlew build`, 'accent', { prefix: '>' }));
    lines.push(createLogLine(`> Task :compileJava`, 'default'));
    lines.push(createLogLine(`> Task :processResources`, 'default'));
    lines.push(createLogLine(`> Task :classes`, 'default'));
    lines.push(createLogLine(`> Task :jar`, 'default'));
    lines.push(createLogLine(`> Task :assemble`, 'default'));
    lines.push(createLogLine(`> Task :compileTestJava`, 'default'));
    lines.push(createLogLine(`> Task :test`, 'default'));
    lines.push(createLogLine(`> Task :check`, 'default'));
    lines.push(createLogLine(`> Task :build`, 'default'));
    lines.push(createLogLine(``, 'default'));
    lines.push(createLogLine(`BUILD SUCCESSFUL in ${Math.floor(Math.random() * 20) + 5}s`, 'success', { glow: true }));
    lines.push(createLogLine(`${Math.floor(Math.random() * 10) + 5} actionable tasks: ${Math.floor(Math.random() * 10) + 5} executed`, 'dim'));
    
    return lines;
  },
];

export const generateCompileLog = (): LogLine[] => {
  const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
  const lines = scenario();
  
  if (lines.length > 0) {
    lines[0].timestamp = getTimestamp();
  }
  
  return lines;
};
