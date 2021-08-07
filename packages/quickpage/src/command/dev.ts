import { readdirSync, statSync } from 'fs-extra';
import { createServer } from 'vite';
import { info, loadViteConfig, autoComplete  } from '../utils/helper';
import path from 'path';

export const dev = async () => {
  try {
    const projectNames = readdirSync('pages');

    const projectName = await autoComplete({
      title: 'Select Project',
      choices: projectNames
      .filter(name => {
        const file = path.resolve('pages', name);
        return statSync(file).isDirectory()
      })
      .map((name: string) => ({ name })),
    });

    const server = await createServer({
      configFile: loadViteConfig(),
      root: path.resolve('pages', projectName.value),
      server: {
        port: 3333,
        open: true,
      },
    });
    await server.listen();
  } catch (err) {
    info(String(err), 'ERROR');
  }
};
