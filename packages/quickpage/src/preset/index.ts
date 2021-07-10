import { existsSync, readFileSync, writeFileSync } from 'fs';
import * as utils from '../utils';
import * as SvelteParam from './svelte';
import * as PreactParam from './preact';
import * as VueParam from './vue';
import * as ReactParam from './react';
import * as TypescriptParam from './typescript';
import debug from 'debug';
import defaultsDeep from 'lodash.defaultsdeep';

const log = debug('quickpage');

interface Param {
  newPluginCue: string;
  importCue: string;
  newPlugin: string;
  devDependencies: Object;
}

function getParam(templateName: string): Param | null {
  if (templateName === 'svelte') return SvelteParam;
  if (templateName === 'preact') return PreactParam;
  if (templateName === 'vue') return VueParam;
  if (templateName === 'react') return ReactParam;
  return null;
}

/**
 * The method to overwrite preset file, like vite.config.js and package.json
 * @param name filename
 * @param callback string operation
 */
function editPreset(name: string, callback: (content: string) => string) {
  const presetFile = utils.resolve(name);

  if (!existsSync(presetFile)) {
    throw new Error(`[Error]: File ${name} does not exist!!`);
  }

  const content = readFileSync(presetFile, { encoding: 'utf-8' });

  const result = callback(content);

  writeFileSync(presetFile, result, { encoding: 'utf-8' });
}

export function addPlugins(otherPlugin: string | undefined, param: Param) {
  const { newPluginCue, newPlugin } = param;
  if (otherPlugin?.includes(newPluginCue)) {
    return `plugins: [\n\t\t${otherPlugin}\n\t]`;
  }
  if (otherPlugin) {
    return `plugins: [\n\t\t${newPlugin},\n\t\t${otherPlugin}]`;
  }
  return `plugins: [\n\t\t${newPlugin}\n\t]`;
}

export function updatePlugins(templateName: string) {
  const param = getParam(templateName);

  if (param) {
    const { newPluginCue, importCue } = param;

    editPreset('vite.config.js', content => {
      let result = content;

      log('result', result);

      const matchPlugin = /(plugins\(.*\))/m;
      result = result.replace(
        matchPlugin,
        (_match, oldPlugin) => `[${oldPlugin}]`
      );

      const matchPlugins = /plugins:[\s\r\n]\[[\s\r\n]*((?:.|\r|\n)+)[\s\r\n]*\]/m;
      result = result.replace(matchPlugins, (_match, otherPlugins) => {
        return addPlugins(otherPlugins, param);
      });

      if (!result.includes(newPluginCue)) {
        result = result.replace(
          'export default defineConfig({',
          `export default defineConfig({\n\t${addPlugins('', param)},`
        );
        result = result.replace(
          'export default {',
          `export default {\n\t${addPlugins('', param)},`
        );
      }

      if (!result.includes(importCue)) {
        result = `${importCue};\n${result}`;
      }

      return result;
    });
  }
}

export function updatePackageJson(templateName: string) {
  const param = getParam(templateName);
  if (param) {
    const { devDependencies } = param;

    editPreset('package.json', content => {
      let result = content;
      const obj = defaultsDeep(JSON.parse(result), { devDependencies });
      result = JSON.stringify(obj, null, 4);

      return result;
    });
  }
}
