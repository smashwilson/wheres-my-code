import chalk from 'chalk';

import Query, {PackageDeployment} from './query';

export default class SummaryQuery extends Query {
  describe(): string {
    let s = 'currently shipped versions of ';
    s += chalk.blue(this.owner + '/' + this.repo);
    return s
  }

  async report() {
    const packageDeployments = await this.getPackageDeployments();

    this.showDeployment(packageDeployments.master)
    this.showDeployment(packageDeployments.nextBetaHotfix)
    this.showDeployment(packageDeployments.beta)
    this.showDeployment(packageDeployments.nextStableHotfix)
    this.showDeployment(packageDeployments.stable)
  }

  private showDeployment(deployment: PackageDeployment) {
    if (!deployment.present) {
      console.log('not present on ' + chalk.green(deployment.description))
      return
    }

    console.log(`on ${chalk.green(deployment.description)} ${chalk.gray('(' + deployment.atomRef + ')')}: ${deployment.packageVersion}`)
  }
}
