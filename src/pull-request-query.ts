import chalk from 'chalk';

import Query from './query';

export default class PullRequestQuery extends Query {
  constructor (owner: string, repo: string, public readonly id: number) {
    super(owner, repo);
  }

  describe(): string {
    let s = 'pull request ';
    s += chalk.bold('#' + this.id);
    s += ' within ';
    s += chalk.blue(this.owner + '/' + this.repo);
    return s
  }
}
