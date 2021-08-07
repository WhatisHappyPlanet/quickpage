import { info, inquireCheckbox, loadViteConfig } from '../utils/helper';
import { readdirSync, statSync } from 'fs-extra';
import { build as viteBuild } from 'vite';
import path from 'path';

export const build = async () => {
  try {
    const projectNames = readdirSync('pages');

    const projectName = await inquireCheckbox({
      title: 'Select Project',
      choices: projectNames
      .filter(name => {
        const file = path.resolve('pages', name);
        return statSync(file).isDirectory()
      })
      .map((name) => ({ name })),
    });

    const promises = projectName.value.map(name => {
      return viteBuild({
        configFile: loadViteConfig(),
        root: path.resolve('pages', name),
        build: {
          outDir: path.resolve('dist', name),
        },
      });
    });

    await Promise.all(promises);
    info('All Pages are built!!!', 'SUCCESS');
  } catch (err) {
    info(String(err), 'ERROR');
  }
};
