export interface ITag {
  content: string
  noteCount: number
}
export class Tag implements ITag {
  content: string = ''
  noteCount: number = 0

  constructor({ content = '', noteCount = 0 }: Partial<ITag>) {
    Object.assign(this, {
      content,
      noteCount,
    })
  }
}
