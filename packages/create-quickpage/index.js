#!/usr/bin/env node
const {
  copySync,
  emptyDirSync,
  existsSync,
  mkdirSync,
  readdirSync,
} = require('fs-extra');
const inquirer = require('inquirer');
const minimist = require('minimist');
const path = require('path');

const cwd = process.cwd();

async function getValidPackageName(projectName) {
  const packageNameRegExp = /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;
  if (packageNameRegExp.test(projectName)) {
    return projectName;
  } else {
    const suggestedPackageName = projectName
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/^[._]/, '')
      .replace(/[^a-z0-9-~]+/g, '-');

    return suggestedPackageName;
  }
}

async function init() {
  const argv = minimist(process.argv.slice(2));
  let targetDir = argv._[0];

  if (!targetDir) {
    const { projectName } = await inquirer.prompt({
      message: 'Project name:',
      type: 'input',
      name: 'projectName',
    });
    targetDir = projectName;
  }

  const root = path.join(cwd, targetDir);
  const packageName = await getValidPackageName(targetDir);
  // TODO: 更新模版里面的packageName

  if (!existsSync(root)) {
    mkdirSync(root);
  } else {
    const existing = readdirSync(root);
    if (existing.length) {
      /**
       * @type {{ yes: boolean }}
       */
      const { yes } = await inquirer.prompt({
        type: 'confirm',
        name: 'yes',
        message:
          (targetDir === '.'
            ? 'Current directory'
            : `Target directory ${targetDir}`) +
          ' is not empty.\n' +
          'Remove existing files and continue?',
      });
      if (yes) {
        emptyDirSync(root);
      } else {
        return;
      }
    }
  }

  copySync(path.join(__dirname, 'template'), root);

  console.log(`\nDone. Now run:\n`);
  if (root !== cwd) {
    console.log(`  cd ${path.relative(cwd, root)}`);
  }
  console.log(`  pnpm install`);
  console.log(`  pnpm run dev`);
  console.log();
}

init().catch(e => {
  console.error(e);
});
