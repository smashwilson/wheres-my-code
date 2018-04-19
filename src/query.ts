export default abstract class Query {
  constructor (public readonly owner: string, public readonly repo: string) {
    //
  }

  abstract describe(): string;

  async report(): Promise<void> {
    return
  }
}
