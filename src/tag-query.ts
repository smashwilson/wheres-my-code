import chalk from 'chalk';

import Query from './query';
import {atom} from './repository';

export default class TagQuery extends Query {
  constructor (owner: string, repo: string, public readonly tag: string | null) {
    super(owner, repo);
  }

  describe(): string {
    let s = '';
    if (this.tag === null) {
      s += 'the ' + chalk.bold('latest') + ' tag'
    } else {
      s += 'tag ' + chalk.bold(this.tag)
    }
    s += ' within ';
    s += chalk.blue(this.owner + '/' + this.repo);
    return s
  }

  async report() {
    const [
      masterVersion, stableVersion, stableHotfixVersion, betaVersion, betaHotfixVersion
    ] = await Promise.all([
      atom.getPackageVersion(this.repo, 'master'),
      atom.getPackageVersion(this.repo, 'v1.25.0'),
      atom.getPackageVersion(this.repo, '1.25-releases'),
      atom.getPackageVersion(this.repo, 'v1.26.0-beta0'),
      atom.getPackageVersion(this.repo, '1.26-releases'),
    ])

    console.log({masterVersion, betaVersion, betaHotfixVersion, stableVersion, stableHotfixVersion})
  }
}
