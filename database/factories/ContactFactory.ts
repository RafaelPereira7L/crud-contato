import Contact from 'App/Models/Contact'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Contact, ({ faker }) => {
  return {
    name: faker.name.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    birthday: faker.date.birthdate(),
  }
}).build()
