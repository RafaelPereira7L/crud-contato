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

  public async search({ request, response }) {
    try {
      // const { name, email, phone } = request.all()
      const { name } = request.all()

      const contact = await Contact.query()
        .where('name', 'ilike', `%${name}%`)
        // .orWhere('email', 'like', `%${email}%`)
        // .orWhere('phone', 'like', `%${phone}%`)
        .paginate(1, 10)

      return response.status(200).send({ success: true, data: contact })
    } catch (error) {
      return response.status(404).send({ success: false, message: error })
    }
  }

  public async store({ request, response }) {
    try {
      const contactSchema = schema.create({
        name: schema.string(),
        email: schema.string([rules.email(), rules.unique({ table: 'contacts', column: 'email' })]),
        phone: schema.string([
          rules.mobile(),
          rules.unique({ table: 'contacts', column: 'phone' }),
        ]),
        birthday: schema.date({ format: 'dd-MM-yyyy' }),
      })

      const payload = await request.validate({ schema: contactSchema })

      const contact = await Contact.create(payload)
      return response
        .status(201)
        .send({ success: true, message: 'Contato criado com sucesso.', data: contact })
    } catch (error) {
      return error
    }
  }

  public async update({ params, request, response }) {
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

      return response
        .status(200)
        .send({ success: true, message: 'Contato atualizado com sucesso.', data: contact })
    } catch (error) {
      return response.status(404).send({ success: false, message: error })
    }
  }

  public async destroy({ params, response }) {
    try {
      const contact = await Contact.findOrFail(params.id)
      await contact.delete()

      return response.status(200).send({ success: true, message: 'Contato deletado com sucesso.' })
    } catch (error) {
      return response.status(404).send({ success: false, message: 'Contato não encontrado.' })
    }
  }
}
