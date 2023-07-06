import * as yup from 'yup'
import YupPassword from 'yup-password'

YupPassword(yup)

const EmailSchema = yup.string().email('Email is invalid').required('Email is required')
const PasswordSchema = yup.string().password().required('Password is required')
const PasswordConfirmationSchema = (passwordFieldName: string) => yup.string()
	.required('Please confirm your password')
	.oneOf([yup.ref(passwordFieldName)], 'Password do not match')

export const LoginSchema = yup.object().shape({
	email: EmailSchema,
	password: yup.string().required('Password is required')
})

export const SignupSchema = yup.object().shape({
	email: EmailSchema,
	password: PasswordSchema,
	confirmPassword: PasswordConfirmationSchema("password"),
	toggle: yup.boolean().oneOf([true], 'Please accept terms and conditions').required()
})

export const ForgotPasswordSchema = yup.object().shape({
	email: EmailSchema
})

export const ResetPasswordSchema = yup.object().shape({
	password: PasswordSchema,
	passwordConfirmation: PasswordConfirmationSchema("password"),
	code: yup.string().required()
})

export const ChangePasswordSchema = yup.object().shape({
	currentPassword: yup.string().required('Current password is required'),
	password: PasswordSchema,
	passwordConfirmation: PasswordConfirmationSchema("password")
})