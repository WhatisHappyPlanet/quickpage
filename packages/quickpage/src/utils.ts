import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';

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

async function prompt<T>({
  title,
  choices,
}: {
  title: string;
  choices: { name: string }[];
}): Promise<T> {
  return new Promise(resolve => {
    inquirer
      .prompt({
        type: 'list',
        message: title,
        name: 'value',
        choices: [new inquirer.Separator(' = Press enter = '), ...choices],
      })
      //@ts-ignore
      .then((result: T) => {
        resolve(result);
      });
  });
}

async function input({ title }: { title: string }) {
  return new Promise(resolve => {
    inquirer
      .prompt({ message: title, type: 'input', name: 'value' })
      //@ts-ignore
      .then((value: string) => {
        resolve(value);
      });
  });
}

function info(message: string, type: string) {
  if (type === 'SUCCESS') {
    console.log(chalk.green(message));
  } else if (type === 'ERROR') {
    console.log(chalk.red(message));
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
