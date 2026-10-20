#!/usr/bin/env node
/**
 * Utilitário para sincronizar data.json -> data.js e shared/
 * Uso:
 *   node sync-data.js
 *   ou
 *   node sync-data.js ~/Downloads/data.json
 */

const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
let sourcePath = path.join(rootDir, 'data.json');

// Se foi passado um ficheiro como argumento (ex: node sync-data.js ~/Downloads/data.json)
if (process.argv[2]) {
  sourcePath = path.resolve(process.argv[2]);
}

if (!fs.existsSync(sourcePath)) {
  console.error(`❌ Erro: Ficheiro não encontrado: ${sourcePath}`);
  process.exit(1);
}

try {
  const raw = fs.readFileSync(sourcePath, 'utf8').trim();
  const parsed = JSON.parse(raw);
  
  const numRows = parsed.rows ? parsed.rows.length : 0;
  const numCols = parsed.columns ? parsed.columns.length : 0;
  const formattedJson = JSON.stringify(parsed, null, 2);
  const jsContent = `window.MATRIX_DATA = ${formattedJson};\n`;

  // 1. Atualizar data.json na raiz e em shared/
  fs.writeFileSync(path.join(rootDir, 'data.json'), formattedJson, 'utf8');
  fs.writeFileSync(path.join(rootDir, 'shared', 'data.json'), formattedJson, 'utf8');

  // 2. Atualizar data.js na raiz e em shared/
  fs.writeFileSync(path.join(rootDir, 'data.js'), jsContent, 'utf8');
  fs.writeFileSync(path.join(rootDir, 'shared', 'data.js'), jsContent, 'utf8');

  console.log(`✅ Sincronização concluída com sucesso!`);
  console.log(`   - Origem: ${sourcePath}`);
  console.log(`   - Linhas (Casos): ${numRows} | Colunas: ${numCols}`);
  console.log(`   - Ficheiros atualizados:`);
  console.log(`     • data.json & shared/data.json`);
  console.log(`     • data.js & shared/data.js (window.MATRIX_DATA)`);
} catch (err) {
  console.error(`❌ Erro ao processar JSON:`, err.message);
  process.exit(1);
}
