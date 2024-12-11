/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const UsersController = () => import('#controllers/users_controller')

// Product Routes
router.post('/api/register', [UsersController, 'register']) // Fetch all products
router.post('/api/verifyRegistration', [UsersController, 'verifyRegistration']) // Fetch all products
router.post('/api/sendLoginOtp', [UsersController, 'sendLoginOtp']) // Fetch all products
router.post('/api/login', [UsersController, 'login']) // Fetch all products
