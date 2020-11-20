export default class User {
  constructor(
    public uid: string,
    public email: string,
    public displayName: string
  ) {
    this.uid = uid
    this.email = email
    this.displayName = displayName
  }
}
