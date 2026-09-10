import { build } from 'esbuild';

// Lambda disables require(ESM); bundle the sanitizer and its ESM dependencies
// together so its CommonJS entry point never needs to require an ESM file.
await build({
  entryPoints: ['sanitize-html'],
  outfile: 'lib/sanitize.cjs',
  bundle: true,
  platform: 'node',
  format: 'cjs',
  target: 'node22',
  legalComments: 'inline'
});
