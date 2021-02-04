import { reactive, toRefs } from '@nuxtjs/composition-api'
import { db } from '@/plugins/firebase'
import { Tag } from '@/models/tag'

export default function useTag() {
  const state = reactive<{
    tags: Tag[]
  }>({
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
export type TagStore = ReturnType<typeof useTag>
