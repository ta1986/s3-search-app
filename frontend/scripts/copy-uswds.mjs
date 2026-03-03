/**
 * Copies pre-compiled USWDS assets from node_modules to public/uswds/.
 * Run: npm run setup:uswds
 */
import { cpSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const uswdsDist = resolve(root, 'node_modules/@uswds/uswds/dist');
const dest = resolve(root, 'public/uswds');

const dirs = [
    { src: `${uswdsDist}/css/uswds.min.css`, dest: `${dest}/css/uswds.min.css` },
    { src: `${uswdsDist}/js/uswds.min.js`, dest: `${dest}/js/uswds.min.js` },
    { src: `${uswdsDist}/img`, dest: `${dest}/img` },
    { src: `${uswdsDist}/fonts`, dest: `${dest}/fonts` },
];

for (const { src, dest: d } of dirs) {
    mkdirSync(dirname(d), { recursive: true });
    cpSync(src, d, { recursive: true });
}

console.log('USWDS assets copied to public/uswds/');
