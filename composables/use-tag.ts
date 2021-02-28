import { reactive, toRefs, inject, provide } from '@nuxtjs/composition-api'
import { db } from '@/plugins/firebase'
import { Tag } from '@/models/tag'
import { InjectionKey } from '@vue/composition-api'

export type TagStore = ReturnType<typeof useTag>

const TagKey: InjectionKey<TagStore> = Symbol('TagStore')

export function provideTagStore() {
  provide(TagKey, useTag())
}
export function useTagStore() {
  return inject(TagKey) as TagStore
}

type State = {
  tags: Tag[]
}

function useTag() {
  const state = reactive<State>({
    tags: [],
  })
  const clear = () => {
    state.tags = []
  }
  const fetchTags = async () => {
    clear()
    const tagsSnapshot = await db
      .collection('tags')
      .orderBy('noteCount', 'desc')
      .limit(5)
      .get()

    tagsSnapshot.forEach((tagDoc) =>
      state.tags.push(new Tag(tagDoc.data()!.content, tagDoc.data()!.noteCount))
    )
  }

  return {
    ...toRefs(state),
    fetchTags,
  }
}
