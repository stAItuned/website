import * as yup from 'yup'

export const UnlockProfileSchema = yup.object().shape({
	firstname: yup.string().required('Firstname is required'),
	lastname: yup.string().required('Lastname is required')
})

export const MoreDetailsSchema = yup.object().shape({
	job: yup.string(),
	linkedin: yup.string(),
	bio: yup.string().max(300, 'Bio must be at most 300 chars long')
})

export const EditProfileSchema = UnlockProfileSchema.concat(MoreDetailsSchema)