const { client } = require('./utils/db');
const { TodoRecord } = require('./records/todo.record');

(async () => {
  try {
    // const todo = await TodoRecord.find('632084269c8f6d527454593d');
    // todo.title = 'Już nie parararara';
    // await todo.update();
    //
    // console.log(await TodoRecord.findAll());

    for await (const todo of await TodoRecord.findAllWithCursor()) { // szybsza wersja
      console.log(new TodoRecord(todo));
    }
  } finally {
    await client.close();
  }
})();
