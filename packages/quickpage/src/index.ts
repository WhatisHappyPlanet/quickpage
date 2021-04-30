#!/usr/bin/env node

import sade from 'sade';
import { create } from './create';

const prog = sade('quickpage');

prog
  .version('1.0.0')
  .option('--global, -g', 'An example global flag')
  .option('-c, --config', 'Provide path to custom config', 'foo.config.js');

prog
  .command('create')
  .describe('Build the source directory. Expects an `index.js` entry file.')
  .example('build app')
  .action(() => {
    console.log(`create`);
    create();
  });

prog.parse(process.argv);