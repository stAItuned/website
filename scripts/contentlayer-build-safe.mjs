import { existsSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

import '@contentlayer/utils/effect/Tracing/Enable'

import * as core from '@contentlayer/core'
import { provideDummyTracing } from '@contentlayer/utils'
import { pipe, provideConsole, T } from '@contentlayer/utils/effect'
import { NodeFsLive } from '@contentlayer/utils/node'

const cwd = process.cwd()
const requiredOutputs = [
  path.join(cwd, '.contentlayer', 'generated', 'Post', '_index.json'),
  path.join(cwd, '.contentlayer', 'generated', 'Team', '_index.json'),
  path.join(cwd, '.contentlayer', 'generated', 'Topic', '_index.json'),
]

const hasGeneratedOutput = () => requiredOutputs.every((filePath) => existsSync(filePath))

const configPathEnv = process.env['CONTENTLAYER_CONFIG_PATH']
const configPath = typeof configPathEnv === 'string' && configPathEnv.trim() !== '' ? configPathEnv.trim() : undefined
const verbose = process.env['CL_DEBUG'] !== undefined

try {
  await pipe(
    core.getConfig({ configPath }),
    T.tap((config) =>
      config.source.options.disableImportAliasWarning ? T.unit : T.fork(core.validateTsconfig),
    ),
    T.chain((config) => core.generateDotpkg({ config, verbose })),
    T.tap(core.logGenerateInfo),
    provideDummyTracing,
    core.provideCwd,
    provideConsole,
    T.provideSomeLayer(NodeFsLive),
    T.runPromise,
  )

  process.exit(0)
} catch (error) {
  if (hasGeneratedOutput()) {
    console.warn('[contentlayer] build exited with an error, but generated files are present. Continuing.')
    process.exit(0)
  }

  console.error('[contentlayer] build failed and no generated files were found.')
  if (error instanceof Error) {
    console.error(error)
  } else {
    console.error(String(error))
  }
  process.exit(1)
}
