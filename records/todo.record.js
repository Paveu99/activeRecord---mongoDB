const { ObjectId, ObjectID } = require('mongodb');
const { todos } = require('../utils/db');

class TodoRecord {
  constructor(obj) {
    this._id = ObjectId(obj._id); // aby zamieniać w obiekt od razu to co ludzie wpiszą jako id
    this.title = obj.title;
    this._validate();
  }

  async insert() {
    const { insertedId } = await todos.insertOne(this); // bierzemy tylko interesującą nas część
    this._id = insertedId;
    return insertedId;
  }

  async delete() {
    await todos.deleteOne({
      _id: this._id,
    });
  }

  static async find(id) {
    const item = await todos.findOne({ _id: ObjectId(String(id)) });
    return item === null ? null : new TodoRecord(item); // jeżeli item jest nullem zwracamy nulla w przeciwnym
    // przypadku zwracamy new TodoRecord - odpowiedź jako TodoRecord
  }

  static async findAll() {
    return (await (await todos.find()).toArray()).map((obj) => new TodoRecord(obj));
  }

  static async findAllWithCursor() {
    return todos.find(); // jak mamy return to nie trzeba używać wówczas await
  }

  async update() { // mozemy zastosować replace
    await todos.replaceOne({
      _id: this._id,
    }, {
      title: String(this.title), // rzutuje na stringa dla bezpieczeństwa aby nikt mi nie dał żadnego unset
    });
  }

  _validate() {
    if (this.title.trim() < 5) { // jeżeli po usunięciu spacji tytuł ma ciągle 5 znaków to jest za krótki
      throw new Error('Todo title should be at least 5 characters.');
    }

    if (this.title.length > 150) {
      throw new Error('To do title should be at most 150 characters.');
    }
  }
}

module.exports = {
  TodoRecord,
};
