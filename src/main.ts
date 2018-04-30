import cli from 'cli';

import SummaryQuery from './summary-query'

export interface Opts {
  repo: string,
  pr?: number,
  tag?: string,
};

export default async function (options: Opts) {
  const [owner, repo] = normalizeRepo(options.repo)
  const query = new SummaryQuery(owner, repo)

  cli.info(`Querying ${query.describe()}.`);

  await query.report()
}

function normalizeRepo (repo: string): [string, string] {
  if (repo.includes('/')) {
    return repo.split('/', 2) as [string, string];
  } else {
    return ['atom', repo];
  }
}
