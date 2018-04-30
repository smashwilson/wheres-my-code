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
    const {latestStable, latestBeta} = await atom.getLatestVersions();

    const branchNameFrom = (version: string) => {
      const m = /(\d+\.\d+)/.exec(version)
      return m && `${m[1]}-releases`
    };

    const stableTag = `v${latestStable}`;
    const stableReleaseBranch = branchNameFrom(latestStable)
    const betaTag = `v${latestBeta}`;
    const betaReleaseBranch = branchNameFrom(latestBeta)

    const taskForVersion = async (atomVersion: string, description: string) => {
      const packageVersion = await atom.getPackageVersion(this.repo, atomVersion)
      return {atomVersion, description, packageVersion}
    }

    const tasks: Promise<{description: string, packageVersion: string | null}>[] = []

    tasks.push(taskForVersion('master', 'master'))
    tasks.push(taskForVersion(stableTag, 'current stable'))
    if (stableReleaseBranch) {
      tasks.push(taskForVersion(stableReleaseBranch, 'next stable hotfix'))
    }
    tasks.push(taskForVersion(betaTag, 'current beta'))
    if (betaReleaseBranch) {
      tasks.push(taskForVersion(betaReleaseBranch, 'next beta hotfix'))
    }

    const results = (await Promise.all(tasks)).filter(({packageVersion}) => Boolean(packageVersion))
    console.log(results)
  }
}
