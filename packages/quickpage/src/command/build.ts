import { info, inquireCheckbox, loadViteConfig } from '../utils';
import { readdirSync } from 'fs-extra';
import { build as viteBuild } from 'vite';
import { join } from 'path';

export const build = async () => {
  try {
    const projectNames = readdirSync('pages');

    const projectName = await inquireCheckbox({
      title: 'Select Project',
      choices: projectNames.map((name: string) => ({ name })),
    });

    const cwd = process.cwd();

    const promises = projectName.value.map(name => {
      return viteBuild({
        configFile: loadViteConfig(),
        root: join(cwd, 'pages', name),
        build: {
          outDir: join(cwd, 'dist', name),
        },
      });
    });

    await Promise.all(promises);
    info('All Pages are built!!!', 'SUCCESS');
  } catch (err) {
    info(String(err), 'ERROR');
  }
};
