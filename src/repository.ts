import util from 'util';

import request from 'request-promise-native';
import cli from 'cli';

async function graphql (query: {}) {
  let foo = null

  cli.debug(`Executing graphQL query:\n${util.inspect(query, {colors: true, depth: null})}`)
  const response = await request({
    method: 'POST',
    uri: 'https://api.github.com/graphql',
    headers: {
      Authorization: `bearer ${process.env.GITHUB_TOKEN}`
    },
    body: {query},
    json: true
  })
  cli.debug(`Response:\n${util.inspect(response, {colors: true, depth: null})}`)

  return response
}

export default class Repository {
  constructor(public readonly name: string) {
    //
  }

  async getFile (relativePath: string, ref: string = 'master') {
    const uri = `https://raw.githubusercontent.com/${this.name}/${ref}/${relativePath}`
    cli.debug(`Fetching file ${relativePath} at ${uri}`);
    const response = await request({uri})
    cli.debug(`File ${relativePath} fetched.`)
    return response;
  }
}

export class AtomRepository extends Repository {
  constructor() {
    super('atom/atom');
  }

  async getPackageVersion(packageName: string, ref: string) : Promise<string | null> {
    const payload = await this.getFile('package.json', ref);
    try {
      const packageData = JSON.parse(payload);
      return packageData.packageDependencies[packageName];
    } catch (e) {
      cli.error(`Unable to parse package.json from atom/atom at ref ${ref}`);
      return null;
    }
  }
}

export const atom = new AtomRepository()
