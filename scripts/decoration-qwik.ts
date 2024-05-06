import { type BuildConfig, run, panic } from './util';
import { join } from 'node:path';
import { readPackageJson, writePackageJson } from './package-json';
import { execa } from 'execa';

const PACKAGE = 'decoration-qwik-runtime';

export async function buildDecorationQwik(config: BuildConfig) {
  const input = join(config.packagesDir, PACKAGE);

  const result = await execa('pnpm', ['build'], {
    stdout: 'inherit',
    cwd: input,
  });

  if (result.failed) {
    panic(`build decoration qwik runtime failed`);
  }
}

export async function publishDecorationQwik(
  config: BuildConfig,
  distTag: string,
  version: string,
  isDryRun: boolean
) {
  const distDir = join(config.packagesDir, PACKAGE, 'dist');
  const cliPkg = await readPackageJson(distDir);

  // update the cli version
  console.log(`   update version = "${version}"`);
  cliPkg.version = version;
  cliPkg.main = 'index.js';
  await writePackageJson(distDir, cliPkg);

  console.log(`⛴ publishing ${cliPkg.name} ${version}`, isDryRun ? '(dry-run)' : '');

  const npmPublishArgs = ['publish', '--tag', distTag];
  await run('npm', npmPublishArgs, isDryRun, isDryRun, { cwd: distDir });

  console.log(
    `🐳 published version "${version}" of ${cliPkg.name} with dist-tag "${distTag}" to npm`,
    isDryRun ? '(dry-run)' : ''
  );
}
