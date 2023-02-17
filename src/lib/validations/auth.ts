import * as yup from "yup"
import YupPassword from 'yup-password'

YupPassword(yup)

const EmailSchema = yup.string().email("Email is invalid").required("Email is required")

export const LoginSchema = yup.object().shape({
    email: EmailSchema,
    password: yup.string().required("Password is required")
})

export const SignupSchema = yup.object().shape({
    firstname: yup.string().required("Firstname is required"),
    lastname: yup.string().required("Lastname is required"),
    email: EmailSchema,
    password: yup.string().password().required("Password is required"),
    confirmPassword: yup.string().required("Please confirm your password").oneOf([yup.ref("password")], "Password do not match")
})