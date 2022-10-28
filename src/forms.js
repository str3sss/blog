import * as Yup from 'yup'

export const createArticleSchema = Yup.object({
  title: Yup.string().trim().required('Title is Required'),
  description: Yup.string().trim().required('Description is Required'),
  body: Yup.string().trim().required('Body is Required'),
})

export const editArticleSchema = Yup.object({
  title: Yup.string().trim().required('Title is Required'),
  description: Yup.string().trim().required('Description is Required'),
  body: Yup.string().trim().required('Body is Required'),
})

export const profileSchema = Yup.object({
  username: Yup.string()
    .transform((value) => (value === '' ? null : value))
    .nullable()
    .min(3, 'Username length should be at least 3 characters')
    .max(20, 'Username cannot exceed more than 20 characters'),
  email: Yup.string()
    .nullable()
    .transform((value) => (value === '' ? null : value))
    .email(),
  password: Yup.string()
    .nullable()
    .transform((value) => (value === '' ? null : value))
    .min(6, 'Password length should be at least 4 characters')
    .max(40, 'Password cannot exceed more than 12 characters'),
  image: Yup.string()
    .nullable()
    .transform((value) => (value === '' ? null : value))
    .url(),
}).test('1 of many field', (value) => !!(value.username || value.email || value.password || value.image))

export const signUpSchema = Yup.object({
  username: Yup.string()
    .required('Username is required')
    .min(3, 'Username length should be at least 3 characters')
    .max(20, 'Username cannot exceed more than 20 characters'),
  email: Yup.string().email().required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password length should be at least 4 characters')
    .max(40, 'Password cannot exceed more than 12 characters'),
  cpassword: Yup.string()
    .required('Confirm Password is required')
    .min(6, 'Password length should be at least 6 characters')
    .max(40, 'Password cannot exceed more than 40 characters')
    .oneOf([Yup.ref('password')], 'Passwords do not match'),
}).required()

export const signInSchema = Yup.object({
  email: Yup.string().email('Email not work').required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password length should be at least 4 characters')
    .max(40, 'Password cannot exceed more than 12 characters'),
})
