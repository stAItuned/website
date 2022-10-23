import { git } from '@lib/git'
import type { CMSData } from '@lib/interfaces'

export const load = async () => {
	return await git.loadData() as CMSData
}
