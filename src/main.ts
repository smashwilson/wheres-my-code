import cli from 'cli';

import PullRequestQuery from './pull-request-query'
import TagQuery from './tag-query'

export interface Opts {
  repo: string,
  pr?: number,
  tag?: string,
};

export default async function (options: Opts) {
  const [owner, repo] = normalizeRepo(options.repo);
  const query = options.pr ?
    new PullRequestQuery(owner, repo, options.pr) :
    new TagQuery(owner, repo, options.tag || null);

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
