import cli from 'cli';

import Query from './query'
import PullRequestQuery from './pull-request-query'
import TagQuery from './tag-query'
import SummaryQuery from './summary-query'

export interface Opts {
  repo: string,
  pr?: number,
  tag?: string,
};

export default async function (options: Opts) {
  const [owner, repo] = normalizeRepo(options.repo)
  const query = createQuery(owner, repo, options)

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

function createQuery (owner: string, repo: string, options: Opts): Query {
  if (options.pr) {
    return new PullRequestQuery(owner, repo, options.pr)
  }

  if (options.tag) {
    return new TagQuery(owner, repo, options.tag || null)
  }

  return new SummaryQuery(owner, repo)
}
