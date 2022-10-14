// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Database from '@ioc:Adonis/Lucid/Database'

import Contact from 'App/Models/Contact'

export default class ContactsController {
  public async index({ response }) {
    try {
      const contacts = await Database.from('contacts').paginate(1, 5)

      return response.status(200).send({ success: true, data: contacts })
    } catch (error) {
      return response
        .status(404)
        .send({ success: false, message: 'Não existem contatos cadastrados.' })
    }
  }

  public async show({ params, response }) {
    try {
      const contact = await Contact.findOrFail(params.id)
      return contact
    } catch (error) {
      return response.status(404).send({ success: false, message: 'Contato não encontrado.' })
    }
  }

  public async search({ request, response, session, view }) {
    try {
      const search = request.input('search')
      const contacts = await Contact.query().where('name', 'ilike', `%${search}%`).paginate(1, 10)

      return view.render('index', { contacts: contacts })
    } catch (error) {
      session.flash('error', 'Erro ao buscar contatos.')
      return response.redirect().back()
    }
  }

  public async store({ request, response, session }) {
    try {
      const contactSchema = schema.create({
        name: schema.string(),
        email: schema.string([rules.email(), rules.unique({ table: 'contacts', column: 'email' })]),
        phone: schema.string([
          rules.mobile(),
          rules.unique({ table: 'contacts', column: 'phone' }),
        ]),
        birthday: schema.date(),
      })

      const payload = await request.validate({ schema: contactSchema })

      await Contact.create(payload)
      return response.redirect().toRoute('/')
    } catch (error) {
      session.flash('error', 'Erro ao cadastrar contato.')
      session.flash('name', request.input('name'))
      session.flash('email', request.input('email'))
      session.flash('phone', request.input('phone'))
      session.flash('birthday', request.input('birthday'))
      return response.redirect().back()
    }
  }

  public async update({ params, request, response, session }) {
    try {
      const contactSchema = schema.create({
        name: schema.string.optional(),
        email: schema.string.optional([
          rules.email(),
          rules.unique({ table: 'contacts', column: 'email', whereNot: { id: params.id } }),
        ]),
        phone: schema.string.optional([
          rules.mobile(),
          rules.unique({ table: 'contacts', column: 'phone', whereNot: { id: params.id } }),
        ]),
        birthday: schema.date.optional(),
      })

      const payload = await request.validate({ schema: contactSchema })

      const contact = await Contact.findOrFail(params.id)
      contact.merge(payload)
      await contact.save()
      session.flash('success', 'Sucesso ao editar contato.')
      return response.redirect().back()
    } catch (error) {
      session.flash('error', 'Erro ao editar contato.')
      return response.redirect().back()
    }
  }

  public async edit({ params, response, view }) {
    try {
      const contact = await Contact.findOrFail(params.id)
      return view.render('edit-contact', { contact: contact })
    } catch (error) {
      return response.status(404).send({ success: false, message: 'Contato não encontrado.' })
    }
  }

  public async destroy({ params, response }) {
    try {
      const contact = await Contact.findOrFail(params.id)
      await contact.delete()

      return response.redirect().toRoute('/')
    } catch (error) {
      return response.status(404).send({ success: false, message: 'Contato não encontrado.' })
    }
  }
}
