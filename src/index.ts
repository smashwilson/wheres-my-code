#!/usr/bin/env node
import cli from 'cli';
import main from './main';

cli.enable('version', 'status')

const options = cli.parse({
  repo: ['r', 'Bundled module repository to query', 'string', null],
  pr: ['p', 'Pull request number to query', 'int', null],
  tag: ['t', 'Tag to query', 'string', null]
})

if (options.repo === null) {
  cli.fatal('Repository must be specified with -r or --repo.')
}

if (options.pr !== null && options.tag !== null) {
  cli.fatal('At most one of -p/--pr and -t/--tag may be specified at once.')
}

main(options).then(
  () => process.exit(0),
  (err) => cli.fatal(err)
)
