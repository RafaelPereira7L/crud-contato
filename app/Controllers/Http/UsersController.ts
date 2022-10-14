import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class UsersController {
  public async show({ params, response }: HttpContextContract) {
    try {
      const user = await User.findOrFail(params.id)
      return response.status(200).send({
        success: true,
        data: {
          name: user.name,
          email: user.email,
        },
      })
    } catch (error) {
      return response.status(404).send({ success: false, message: 'Usuário não encontrado.' })
    }
  }

  public async login({ request, response, auth, session }: HttpContextContract) {
    const login = request.input('login')
    const password = request.input('password')

    try {
      await auth.use('web').attempt(login, password)
      session.flash('success', 'Login realizado com sucesso.')
      return response.redirect().toPath('/')
    } catch {
      session.flash('error', 'Usuário ou senha inválidos.')
      return response.redirect().toPath('/login')
    }
  }

  public async logout({ auth, response, session }: HttpContextContract) {
    try {
      await auth.use('web').logout()
      session.flash('success', 'Logout realizado com sucesso.')
      return response.redirect().toPath('/')
    } catch (error) {
      session.flash('error', 'Erro ao realizar logout.')
      return response.redirect().toPath('/')
    }
  }

  public async store({ request, response, session }: HttpContextContract) {
    try {
      const userSchema = schema.create({
        login: schema.string([rules.unique({ table: 'users', column: 'login' })]),
        name: schema.string(),
        email: schema.string([rules.email(), rules.unique({ table: 'users', column: 'email' })]),
        password: schema.string([rules.minLength(6)]),
      })

      const payload = await request.validate({ schema: userSchema })
      await User.create(payload)
      session.flash('success', 'Usuário cadastrado com sucesso.')
      return response.redirect().toPath('/')
    } catch (error) {
      session.flash('error', 'Erro ao realizar cadastro.')
      return response.redirect().toPath('/register')
    }
  }
}
