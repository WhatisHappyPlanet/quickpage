import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';

async function writeFile(dist: string, content: string) {
  return new Promise((resolve) => {
    console.log('dist :>> ', dist);
    fs.writeFile(dist, content, function () {
      resolve('done');
    });
  });
}

async function createDir(dist: string) {
  return new Promise((resolve) => {
    fs.mkdirSync(dist);
    resolve('done');
  });
}

function copyFile(src: string, dist: string) {
  fs.writeFileSync(dist, fs.readFileSync(src));
}

async function readFile(src: string) {
  return new Promise((resolve) => {
    fs.readFile(src, (err: any, data: any) => {
      if (!err) {
        resolve(data);
      }
    });
  });
}

async function prompt({
  title,
  choices,
}: {
  title: string;
  choices: { name: string }[];
}) {
  return inquirer.prompt({
    type: 'list',
    message: title,
    name: 'value',
    choices: [new inquirer.Separator(' = Press enter = '), ...choices],
  });
}

function input({ title }: { title: string }) {
  return inquirer.prompt({
    message: title,
    type: 'input',
    name: 'value',
  });
}

function info(message: string, type: 'SUCCESS' | 'ERROR') {
  if (type === 'SUCCESS') {
    console.log(chalk.green(`[${type}]${message}`));
  } else if (type === 'ERROR') {
    console.log(chalk.red(`[${type}]${message}`));
  }
}

function resolve(_path: string) {
  const cwd = process.cwd();
  return path.resolve(cwd, _path);
}

export {
  writeFile,
  createDir,
  copyFile,
  readFile,
  resolve,
  prompt,
  input,
  info,
};
