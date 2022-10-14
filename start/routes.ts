/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'
import Database from '@ioc:Adonis/Lucid/Database'

/*
 |--------------------------------------------------------------------------
 | API REST Routes
 |--------------------------------------------------------------------------
*/

Route.group(() => {
  Route.get('/logout', 'UsersController.logout').as('users.logout')
  Route.get('/:id', 'UsersController.show').as('users.show')
  Route.post('/register', 'UsersController.store').as('users.store')
  Route.post('/login', 'UsersController.login').as('users.login')
}).prefix('/api/auth')

Route.group(() => {
  Route.get('/', 'ContactsController.index').as('contacts.index')
  Route.get('/:id', 'ContactsController.show').as('contacts.show')
  Route.get('/search/:params?', 'ContactsController.search').as('contacts.search')

  Route.post('/', 'ContactsController.store').as('contacts.store')

  Route.put('/:id', 'ContactsController.update').as('contacts.update')

  Route.get('/:id/delete', 'ContactsController.destroy').as('contacts.destroy')
})
  .prefix('/api/default/CRM_CONTATO')
  .middleware('auth')

/*
 |--------------------------------------------------------------------------
 | Web Routes
 |--------------------------------------------------------------------------
*/

Route.get('/', async ({ view }) => {
  const contacts = await Database.from('contacts').paginate(1, 5)
  contacts.baseUrl('/')
  return view.render('index', { contacts: contacts })
})
  .as('index')
  .middleware('auth')

Route.get('/login', async ({ view }) => {
  return view.render('login')
})

Route.get('/register', async ({ view }) => {
  return view.render('register')
})
