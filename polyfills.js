const builder = require('core-js-builder');
const { writeFileSync } = require('fs');

async function generate () {
  

  
  let polyfills = await builder({
    modules: ['core-js/actual/promise', 'core-js/actual/set'],
    format: 'bundle',
    targets: '> 0.15%'
  });

  writeFileSync(process.cwd() + '/src/lib/workers/polyfills.ts', `const polyfills = \`${polyfills.replace(/\`/g, '\\`')}\`; export default polyfills;`);
  
}

generate();