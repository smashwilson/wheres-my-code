#!/usr/bin/env node
import cli from 'cli';
import main from './main';

cli.enable('version', 'status')

const options = cli.parse({
  repo: ['r', 'Bundled module repository to query', 'string', null],
})

if (options.repo === null) {
  cli.fatal('Repository must be specified with -r or --repo.')
}

main(options).then(
  () => process.exit(0),
  (err) => cli.fatal(err)
)
