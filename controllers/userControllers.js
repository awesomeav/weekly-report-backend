import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
// import {generateToken} from '../utils/authUtils.js'

// User Controllers
// CRUD operations
// userLogin - login user
// userLogout - logout user
// userRegister - register user
// getUsers - get all users
// getUserById - get user by id
// getUserProfile - get user profile
// updateUserProfile - update user profile
// deleteUser - delete user

//@desc     Auth a user and get a token
//@route    POST /api/users/login
//@access   Public
export const userLogin = asyncHandler(async (req, res) => {
  // find a user based on email
  const { email, password } = req.body

  const user = await User.findOne({ email })

  // authenticate the user
  if (user && (await user.matchPassword(password))) {
    // return response token with user to frontend client
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }
})

//@desc     Log out a user
//@route    GET /api/users/logout
//@access   Public
export const userLogout = asyncHandler(async (req, res) => {
  res.clearCookie('t')
  res.json({ message: 'Logout success' })
})

//@desc     Register a new user
//@route    POST /api/users
//@access   Public
export const userRegister = asyncHandler(async (req, res) => {
  // console.log(req.body)
  const {
    name,
    email,
    password,
    about,
    role,
    date_of_join,
    department,
    gender,
  } = req.body

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  const user = await User.create({
    name,
    email,
    password,
    about,
    role,
    date_of_join,
    department,
    gender,
  })

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      date_of_join,
      department,
      gender,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// @desc    Get all users
// @route   GET /api/users
// @access  Public
export const getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find({})
    .select('-hashed_password')
    .select('-salt')
    .select('-__v')
    .select('-updatedAt')

  if (users) {
    res.json(users)
  } else {
    res.status(404)
    throw new Error('Users not found')
  }
})

// @desc    Get a user by id
// @route   GET /api/users/:id
// @access  Private / Admin
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('-hashed_password')
    .select('-salt')
    .select('-updatedAt')
    .select('-__v')

  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc     Get a user profile
// @route    GET /api/users/:id/profile
// @access   Private
export const getUserProfile = asyncHandler(async (req, res) => {
  // console.log('req.user._id', req.user._id)
  // console.log('req.params.id', req.params.id)
  if (req.user._id == req.params.id) {
    const user = await User.findById(req.params.id)

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        role: user.role,
        project: user.project,
        email: user.email,
        dateofjoin: user.dateofjoin,
        department: user.department,
        gender: user.gender,
      })
    } else {
      res.status(404)
      throw new Error('User not found')
    }
  } else {
    res.status(401)
    throw new Error('User not authorized')
  }
})

// @desc    Update user profile
// @route   PUT /api/users/:id/
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  if (req.user._id == req.params.id) {
    const user = await User.findById(req.params.id)

    if (user) {
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email
      user.about = req.body.about || user.about
      if (req.body.password) {
        user.password = req.body.password
      }

      const updatedUser = await user.save()

      if (updatedUser) {
        res.json({
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          about: updatedUser.about,
          role: updatedUser.role,
          history: updatedUser.history,
          createdAt: updatedUser.createdAt,
        })
      } else {
        res.status(400)
        throw new Error('User not updated')
      }
    } else {
      res.status(404)
      throw new Error('User not found')
    }
  } else {
    res.status(401)
    throw new Error('User not authorized')
  }
})

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private
export const deleteUser = asyncHandler(async (req, res) => {
  if (req.user._id == req.params.id) {
    const user = await User.findById(req.params.id)

    if (user) {
      await user.remove()
      res.status(200).json({
        message: 'User deleted',
      })
    } else {
      res.status(404)
      throw new Error('User not found')
    }
  } else {
    res.status(401)
    throw new Error('User not authorized')
  }
})
