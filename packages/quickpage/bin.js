#!/usr/bin/env node
const sade = require('sade');
const updater = require('pkg-updater');
const pkg = require('./package.json');
const quickpage = require('./lib');

const prog = sade('quickpage');


updater({
  pkg: pkg,
  checkInterval: 24 * 60 * 60 * 1000,
}).then(() => {

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
});

