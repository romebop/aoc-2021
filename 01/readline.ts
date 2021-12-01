import { createReadStream } from 'fs';
import { createInterface } from 'readline';

const inputFile = process.argv.slice(2)[0];

var readInterface = createInterface({
  input: createReadStream(inputFile),
});

readInterface.on('line', line => {
  console.log(line);
});