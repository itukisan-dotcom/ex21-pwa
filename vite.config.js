import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
export default defineConfig({ base: '/ex21-pwa/', plugins: [{
 name: 'offline-precache',
 generateBundle(_, bundle) {
  const assets = Object.keys(bundle).filter(name => /\.(js|css)$/.test(name));
  this.emitFile({type:'asset',fileName:'sw.js',source:readFileSync('public/sw.js','utf8').replace('/* BUILD_ASSETS */[]',JSON.stringify(assets))});
 }
}] });
