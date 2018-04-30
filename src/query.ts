import {atom} from './repository';

export interface AtomRefs {
  stableTag: string,
  stableReleaseBranch: string | null,
  betaTag: string,
  betaReleaseBranch: string | null,
}

export interface PackageDeployment {
  atomRef: string,
  packageVersion: string,
  description: string,
  present: boolean,
}

export interface PackageDeployments {
  master: PackageDeployment,
  stable: PackageDeployment,
  nextStableHotfix: PackageDeployment,
  beta: PackageDeployment,
  nextBetaHotfix: PackageDeployment,
}

export default abstract class Query {
  constructor (public readonly owner: string, public readonly repo: string) {
    //
  }

  abstract describe(): string;

  async report(): Promise<void> {
    return
  }

  async getPackageDeployments(): Promise<PackageDeployments> {
    const {latestStable, latestBeta} = await atom.getLatestVersions();

    const stableTag = `v${latestStable}`;
    const stableReleaseBranch = branchNameFrom(latestStable)
    const betaTag = `v${latestBeta}`;
    const betaReleaseBranch = branchNameFrom(latestBeta)

    const tasks = [
      this.taskForRef('master', 'master'),
      this.taskForRef(stableTag, 'current stable'),
      this.taskForRef(stableReleaseBranch, 'next stable hotfix'),
      this.taskForRef(betaTag, 'current beta'),
      this.taskForRef(betaReleaseBranch, 'next beta hotfix'),
    ]

    const [master, stable, nextStableHotfix, beta, nextBetaHotfix] = await Promise.all(tasks)
    return {master, stable, nextStableHotfix, beta, nextBetaHotfix}
  }

  private async taskForRef(atomRef: string | null, description: string): Promise<PackageDeployment> {
    if (!atomRef) {
      return {atomRef: '<not found>', description, packageVersion: '<not found>', present: false}
    }

    const packageVersion = await atom.getPackageVersion(this.repo, atomRef)
    if (!packageVersion) {
      return {atomRef, description, packageVersion: '<not found>', present: false}
    }

    return {atomRef, description, packageVersion, present: true}
  }
}

function branchNameFrom (version: string): string | null {
  const m = /^(\d+\.\d+)/.exec(version)
  return m && `${m[1]}-releases`
}
