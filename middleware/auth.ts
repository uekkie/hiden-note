import { Context } from '@nuxt/types'
import useAuth from '@/use/use-auth'
const { user } = useAuth()

export default function ({ route, redirect }: Context) {
  const isRootPath = route.name === 'index'
  if (user) {
    if (isRootPath) {
      return redirect({
        name: 'notes',
      })
    }
  } else if (!isRootPath) {
    return redirect({
      name: '/',
    })
  }
}
