#!/usr/bin/env node
const sade = require('sade');
const pkg = require('./package.json');
const quickpage = require('./lib');

const prog = sade('quickpage');


prog.version(pkg.version);

prog
  .command('create')
  .describe('create a page in this multi-page project')
  .example('build')
  .action(() => {
    quickpage.create();
  });

prog
  .command('dev')
  .describe('local develope a page in this multi-page project')
  .example('dev')
  .action(() => {
    quickpage.dev();
  });

prog
  .command('build')
  .describe('build a page or pages in this multi-page project')
  .example('build')
  .action(() => {
    quickpage.build();
  });

prog.parse(process.argv);

