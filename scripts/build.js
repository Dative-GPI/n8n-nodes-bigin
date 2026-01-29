const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { glob } = require('glob');

// 1. Nettoyer dist/
console.log('Cleaning dist/...');
fs.rmSync('dist', { recursive: true, force: true });

// 2. Compiler TypeScript
console.log('Building TypeScript...');
try {
  execSync('tsc', { stdio: 'inherit' });
} catch (error) {
  console.error('TypeScript build failed');
  process.exit(1);
}

// 3. Copier les fichiers statiques
console.log('Copying static files...');
const staticFiles = glob.sync(['**/*.{png,svg}', '**/__schema__/**/*.json'], {
  ignore: ['dist', 'node_modules'],
});

staticFiles.forEach(file => {
  const destPath = path.join('dist', file);
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.copyFileSync(file, destPath);
});

console.log('Build successful');