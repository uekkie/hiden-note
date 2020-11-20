export class Note {
  constructor(
    public id: string,
    public userId: string,
    public title: string,
    public content: string
  ) {
    this.id = id
    this.userId = userId
    this.title = title
    this.content = content
  }
}
