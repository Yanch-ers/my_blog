import { buildTitleUrlMap } from './src/lib/title-url-map.ts';

const map = buildTitleUrlMap();

console.log('Map size:', map.size);

for (const [key, value] of map) {
  if (key.includes('AIOps') || value.url.includes('aiops')) {
    console.log('Key:', key);
    console.log('URL:', value.url);
    console.log('---');
  }
}

for (const [key, value] of map) {
  if (value.url.includes('\\')) {
    console.log('URL with backslash:', value.url);
    console.log('Key:', key);
    console.log('---');
  }
}
