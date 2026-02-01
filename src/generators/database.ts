import type { LogLine } from '../components/Terminal/TerminalLine';
import { createLogLine, getTimestamp } from '../hooks/useLogEngine';

const tables = ['users', 'orders', 'products', 'sessions', 'logs', 'payments', 'notifications', 'analytics'];
const getRandomTable = () => tables[Math.floor(Math.random() * tables.length)];

const scenarios = [
  // SQL queries
  () => {
    const lines: LogLine[] = [];
    const table = getRandomTable();
    const time = (Math.random() * 100 + 1).toFixed(2);
    const rows = Math.floor(Math.random() * 1000) + 1;
    
    const queries = [
      `SELECT * FROM ${table} WHERE status = 'active' LIMIT 100`,
      `INSERT INTO ${table} (name, email, created_at) VALUES (?, ?, NOW())`,
      `UPDATE ${table} SET updated_at = NOW() WHERE id = ?`,
      `DELETE FROM ${table} WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY)`,
      `SELECT COUNT(*) FROM ${table} GROUP BY status`,
      `SELECT t1.*, t2.name FROM ${table} t1 JOIN ${getRandomTable()} t2 ON t1.id = t2.ref_id`,
    ];
    
    const query = queries[Math.floor(Math.random() * queries.length)];
    
    lines.push(createLogLine(`[SQL] ${query}`, 'info'));
    lines.push(createLogLine(`[SQL] Query OK, ${rows} rows affected (${time}ms)`, 'success'));
    
    return lines;
  },
  
  // Migration logs
  () => {
    const lines: LogLine[] = [];
    const migrationId = `${Date.now()}_${['create', 'add', 'modify', 'drop'][Math.floor(Math.random() * 4)]}_${getRandomTable()}`;
    
    lines.push(createLogLine(`[Migration] Running: ${migrationId}`, 'info'));
    lines.push(createLogLine(`[Migration] Creating table ${getRandomTable()}...`, 'dim'));
    lines.push(createLogLine(`[Migration] Adding index on (user_id, created_at)...`, 'dim'));
    lines.push(createLogLine(`[Migration] ✓ ${migrationId} completed`, 'success'));
    
    return lines;
  },
  
  // Connection pool status
  () => {
    const lines: LogLine[] = [];
    const active = Math.floor(Math.random() * 20) + 5;
    const idle = Math.floor(Math.random() * 30) + 10;
    const waiting = Math.floor(Math.random() * 5);
    
    lines.push(createLogLine(`[Pool] Connection pool status:`, 'info'));
    lines.push(createLogLine(`[Pool]   Active: ${active}, Idle: ${idle}, Waiting: ${waiting}`, 'dim'));
    
    if (waiting > 3) {
      lines.push(createLogLine(`[Pool] Warning: High connection wait time`, 'warning'));
    }
    
    return lines;
  },
  
  // Prisma/ORM logs
  () => {
    const lines: LogLine[] = [];
    const table = getRandomTable();
    const time = (Math.random() * 50 + 1).toFixed(0);
    
    const operations = [
      `prisma:query SELECT \`${table}\`.\`id\`, \`${table}\`.\`name\` FROM \`${table}\` WHERE \`${table}\`.\`id\` = ?`,
      `prisma:query INSERT INTO \`${table}\` (\`id\`, \`name\`) VALUES (?, ?)`,
      `prisma:query UPDATE \`${table}\` SET \`updated_at\` = ? WHERE \`id\` = ?`,
      `prisma:info Starting transaction...`,
      `prisma:info Transaction committed`,
    ];
    
    const op = operations[Math.floor(Math.random() * operations.length)];
    lines.push(createLogLine(op, 'dim'));
    
    if (!op.includes('info')) {
      lines.push(createLogLine(`prisma:query ${time}ms`, 'dim'));
    }
    
    return lines;
  },
  
  // Redis operations
  () => {
    const lines: LogLine[] = [];
    const keys = ['session:abc123', 'cache:products', 'rate:192.168.1.1', 'queue:emails', 'lock:payment'];
    const key = keys[Math.floor(Math.random() * keys.length)];
    
    const operations = [
      { cmd: `GET ${key}`, result: 'OK' },
      { cmd: `SET ${key} "value" EX 3600`, result: 'OK' },
      { cmd: `DEL ${key}`, result: '(integer) 1' },
      { cmd: `INCR ${key.replace(':', ':counter:')}`, result: `(integer) ${Math.floor(Math.random() * 1000)}` },
      { cmd: `EXPIRE ${key} 3600`, result: '(integer) 1' },
      { cmd: `TTL ${key}`, result: `(integer) ${Math.floor(Math.random() * 3600)}` },
    ];
    
    const op = operations[Math.floor(Math.random() * operations.length)];
    lines.push(createLogLine(`[Redis] > ${op.cmd}`, 'info'));
    lines.push(createLogLine(`[Redis] ${op.result}`, 'success'));
    
    return lines;
  },
  
  // MongoDB operations
  () => {
    const lines: LogLine[] = [];
    const collections = ['users', 'orders', 'products', 'logs'];
    const collection = collections[Math.floor(Math.random() * collections.length)];
    const time = (Math.random() * 50 + 1).toFixed(0);
    const count = Math.floor(Math.random() * 100) + 1;
    
    const operations = [
      `db.${collection}.find({ status: "active" }).limit(10)`,
      `db.${collection}.insertOne({ name: "item", createdAt: new Date() })`,
      `db.${collection}.updateMany({ active: true }, { $set: { updatedAt: new Date() } })`,
      `db.${collection}.aggregate([{ $match: {} }, { $group: { _id: "$type", count: { $sum: 1 } } }])`,
      `db.${collection}.createIndex({ "userId": 1, "createdAt": -1 })`,
    ];
    
    const op = operations[Math.floor(Math.random() * operations.length)];
    lines.push(createLogLine(`[MongoDB] ${op}`, 'info'));
    lines.push(createLogLine(`[MongoDB] ${count} document(s) (${time}ms)`, 'success'));
    
    return lines;
  },
  
  // Database backup
  () => {
    const lines: LogLine[] = [];
    const dbName = 'production_db';
    const size = (Math.random() * 500 + 50).toFixed(2);
    
    lines.push(createLogLine(`[Backup] Starting backup for ${dbName}...`, 'info'));
    lines.push(createLogLine(`[Backup] Dumping tables: ${tables.slice(0, 4).join(', ')}...`, 'dim'));
    lines.push(createLogLine(`[Backup] Compressing backup file...`, 'dim'));
    lines.push(createLogLine(`[Backup] ✓ Backup complete: ${dbName}_${Date.now()}.sql.gz (${size} MB)`, 'success'));
    
    return lines;
  },
  
  // Slow query log
  () => {
    const lines: LogLine[] = [];
    const table = getRandomTable();
    const time = (Math.random() * 5000 + 1000).toFixed(0);
    
    lines.push(createLogLine(`[SlowQuery] Query exceeded threshold (${time}ms > 1000ms):`, 'warning'));
    lines.push(createLogLine(`[SlowQuery] SELECT * FROM ${table} WHERE status IN (?, ?, ?) ORDER BY created_at DESC`, 'warning'));
    lines.push(createLogLine(`[SlowQuery] Consider adding index on (status, created_at)`, 'dim'));
    
    return lines;
  },
];

export const generateDatabaseLog = (): LogLine[] => {
  const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
  const lines = scenario();
  
  if (lines.length > 0 && !lines[0].timestamp) {
    lines[0].timestamp = getTimestamp();
  }
  
  return lines;
};
