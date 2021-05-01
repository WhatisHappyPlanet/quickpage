#!/usr/bin/env node

import sade from 'sade';
import { create } from './create';
import { dev } from './dev';

const prog = sade('quickpage');

prog.version('1.0.0');

prog
  .command('create')
  .describe('create a page in this multi-page project')
  .example('build app')
  .action(() => {
    create();
  });

prog
  .command('dev')
  .describe('local develope a page in this multi-page project')
  .example('dev app')
  .action(() => {
    dev();
  });

prog.parse(process.argv);
