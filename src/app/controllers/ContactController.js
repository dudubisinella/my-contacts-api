const ContactsRepository = require('../repositories/ContactsRepository')

class ContactController {
  async index(request, response) {
    const {orderBy } = request.query;

    const contacts = await ContactsRepository.findAll(orderBy);

    response.json(contacts);
  }

  async show(request, response) {
    const { id } = request.params;

    const contact = await ContactsRepository.findById(id);

    if (!contact) {
      return response.status(404).json({error: 'User not found'});
    }

    response.json(contact);
  }

  async store(request,response) {
    const { name, email, phone, category_id } = request.body;

    const contactExists = await ContactsRepository.findByEmail(email);

    if(contactExists) {
      return response.status(400).json({error: 'This e-mail is already in use'});
    }

    const contact = await ContactsRepository.create({
      name,
      email,
      phone,
      category_id
    });

    response.json(contact);
  }

  async update(request,response) {
    const { id } = request.params;
    const { name, email, phone, category_id } = request.body;

    const contact = await ContactsRepository.findById(id);

    if (!contact) {
      return response.status(404).json({error: 'User not found'});
    }

    const contactExists = await ContactsRepository.findByEmail(email);

    if(contact.email !== email && contactExists) {
      return response.status(400).json({error: 'This e-mail is already in use'});
    }

    const contactUpdate = await ContactsRepository.update(id, {
      name,
      email,
      phone,
      category_id
    });

    response.json(contactUpdate);
  }

  async delete(request, response) {
    const { id } = request.params;

    await ContactsRepository.delete(id);

    response.sendStatus(204);
  }
}

module.exports = new ContactController();
