#!/usr/bin/env node

import sade from 'sade';
import { build } from './command/build';
import { create } from './command/create';
import { dev } from './command/dev';

const prog = sade('quickpage');

prog.version('1.0.0');

prog
  .command('create')
  .describe('create a page in this multi-page project')
  .example('build')
  .action(() => {
    create();
  });

prog
  .command('dev')
  .describe('local develope a page in this multi-page project')
  .example('dev')
  .action(() => {
    dev();
  });

prog
  .command('build')
  .describe('build a page or pages in this multi-page project')
  .example('build')
  .action(() => {
    build();
  });

prog.parse(process.argv);
