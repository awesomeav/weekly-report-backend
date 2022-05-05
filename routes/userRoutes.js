import express from 'express'
import {
  getUsers,
  getUserById,
  getUserProfile,
  updateUserProfile,
  userLogin,
  userRegister,
  deleteUser,
} from '../controllers/userControllers.js'
// import { userSignupValidator } from '../middlewares/userValidatorMiddleware.js'
import { isAuth, isAdmin } from '../middlewares/authMiddlewares.js'

const router = express.Router()

router.route('/').post(userRegister).get(getUsers)
// .get(isAuth, isAdmin, getAllUsers)
router.route('/login').post(userLogin)
router.route('/:id').get(getUserById).put(updateUserProfile)
// router.route('/:id').get(isAuth, isAdmin, getUserById).put(updateUserProfile)
router.route('/:id/profile').get(getUserProfile)
// router.route('/:id/profile').get(isAuth, getUserProfile)
router.route('/:id/profile').delete(deleteUser)

export default router
