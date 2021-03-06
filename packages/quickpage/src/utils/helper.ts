import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import inquirerAutoComplete from 'inquirer-autocomplete-prompt';
import fuzzy from 'fuzzy';

async function writeFile(dist: string, content: string) {
  return new Promise(resolve => {
    console.log('dist :>> ', dist);
    fs.writeFile(dist, content, function() {
      resolve('done');
    });
  });
}

async function createDir(dist: string) {
  return new Promise(resolve => {
    fs.mkdirSync(dist);
    resolve('done');
  });
}

function copyFile(src: string, dist: string) {
  fs.writeFileSync(dist, fs.readFileSync(src));
}

async function readFile(src: string) {
  return new Promise(resolve => {
    fs.readFile(src, (err: any, data: any) => {
      if (!err) {
        resolve(data);
      }
    });
  });
}

async function autoComplete(params: {
  title: string;
  choices: { name: string }[];
}) {
  const { title, choices } = params;

  async function search(answers: string, input: string) {
    input = input || '';
    const choiceNames = choices.map(s => s.name);
    const res = fuzzy.filter(input, choiceNames);
    return res.map(el => el.original);
  }

  inquirer.registerPrompt('autocomplete', inquirerAutoComplete);
  return inquirer.prompt<{ value: string }>({
    //@ts-ignore
    type: 'autocomplete',
    name: 'value',
    suggestOnly: false,
    message: title,
    searchText: 'Searching for you!',
    emptyText: 'Nothing found!',
    source: search,
    pageSize: 10,
  });
}

async function inquireList(params: {
  title: string;
  choices: { name: string }[];
}) {
  const { title, choices } = params;
  return inquirer.prompt<{ value: string }>({
    type: 'list',
    message: title,
    name: 'value',
    choices: [new inquirer.Separator(' = Press enter = '), ...choices],
  });
}

async function inquireInput(params: { title: string }) {
  const { title } = params;
  return inquirer.prompt<{ value: string }>({
    message: title,
    type: 'input',
    name: 'value',
  });
}

async function inquireCheckbox(params: {
  title: string;
  choices: { name: string }[];
}) {
  const { title, choices } = params;
  return inquirer.prompt<{ value: string[] }>({
    message: title,
    type: 'checkbox',
    name: 'value',
    choices: [new inquirer.Separator(' = Press enter = '), ...choices],
  });
}

function info(message: string, type: 'SUCCESS' | 'ERROR') {
  if (type === 'SUCCESS') {
    console.log(chalk.green(`[${type}] ${message}`));
  } else if (type === 'ERROR') {
    console.log(chalk.red(`[${type}] ${message}`));
  }
}

function resolve(_path: string) {
  const cwd = process.cwd();
  return path.resolve(cwd, _path);
}

function loadViteConfig(configRoot: string = process.cwd()) {
  let resolvedPath = '';
  const jsconfigFile = path.resolve(configRoot, 'vite.config.js');
  if (fs.existsSync(jsconfigFile)) {
    resolvedPath = jsconfigFile;
  }

  return resolvedPath || undefined;
}

export {
  writeFile,
  createDir,
  copyFile,
  readFile,
  resolve,
  inquireList,
  inquireInput,
  inquireCheckbox,
  autoComplete,
  info,
  loadViteConfig,
};
