import * as fs from 'fs';
import { logger } from '../utils';

function writeWithBackPressure(writeableStream: fs.WriteStream, chunk: Buffer) {
  const hasMoreRoom = writeableStream.write(chunk);
  if (hasMoreRoom) {
    return Promise.resolve(null);
  } else {
    return new Promise((resolve) => {
      writeableStream.once('drain', resolve);
    });
  }
}

async function findUsersTotalAmountPaid(
  fileName: string,
): Promise<Map<string, number>> {
  const stream = fs.createReadStream(fileName, { highWaterMark: 8192 });

  const map = new Map<string, number>();
  const remainingBuffer = Buffer.alloc(32);
  let remainingBufferContentLength = 0;
  let recordCount = 0;

  for await (let chunk of stream) {
    //process the chunk
    let bufferOffset = 0;
    // Copy the remaining buffer from the previous call to the current chunk
    if (remainingBufferContentLength > 0) {
      chunk = Buffer.concat([
        remainingBuffer.slice(0, remainingBufferContentLength),
        chunk,
      ]);
      remainingBufferContentLength = 0;
    }

    // Process fully available records
    while (recordFullyAvailable(chunk, bufferOffset)) {
      logger.debug(`Record Read ${recordCount++}`);
      bufferOffset = processRecord(chunk, bufferOffset);
    }
    // Update the remaining buffer
    remainingBufferContentLength = chunk.length - bufferOffset;
    chunk.copy(remainingBuffer, 0, bufferOffset, chunk.length);
  }

  return map;

  function processRecord(buffer: Buffer, offset: number) {
    const nameLen = buffer.readUInt16LE(offset);
    offset += 2;
    const name = buffer.toString('ascii', offset, offset + nameLen);
    offset += nameLen;
    const amount = buffer.readDoubleLE(offset);
    if (map.has(name)) {
      map.set(name, map.get(name) + amount);
    } else {
      map.set(name, amount);
    }
    logger.debug(`name: ${name}, amount: ${amount}`);
    return offset + 8;
  }

  function recordFullyAvailable(buffer: Buffer, offset: number) {
    if (offset + 2 > buffer.length) return false;
    const nameLen = buffer.readUInt16LE(offset);
    return offset + nameLen + 10 <= buffer.length;
  }
}

/**
 * Asked to chatGPT - Write a typescript function which generate random string of length n
 * Updated : change it to generate string of variable size between the length of n to m
 * @param n length of string needed
 * @returns a string
 */
function generateRandomString(n: number, m: number): string {
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  const charactersLength = characters.length;
  const randomLength = Math.floor(Math.random() * (m - n + 1) + n);
  for (let i = 0; i < randomLength; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
/***
 * Let create a binary file with lots of records
 * Below is our encoding format.
 * 16 bit length of string
 * ascii chars based on above length
 * a 64 bit double
 */
describe('Simple Test', () => {
  const mapExpected = new Map<string, number>();
  const fileName = 'records.bin'; // We are creating a binary file
  /**
   * R1 R2 ...  Rn
   * R1 = [2bytes Length LE, [a,b,c], double store LE ]
   */
  beforeAll(async () => {
    const NUM_RECORDS = 100_000;
    await fs.promises.unlink(fileName);

    // We are assuming this is good enough to store our variable length record
    const stream = fs.createWriteStream(fileName, { highWaterMark: 8192 });
    let totalBytesWritten = 0;
    for (let i = 0; i < NUM_RECORDS; i++) {
      const buf = Buffer.alloc(32); // 32 bytes long buffer. We will multiple of these in memory
      const namePerson = generateRandomString(4, 5);
      const amountPaid = Math.random() * 120 + 1;
      let offset = 0;
      offset = buf.writeUInt16LE(namePerson.length, offset);
      logger.debug(`Record number ${i}`);
      logger.debug(`write length offset ${offset}`);
      logger.debug(`name ${namePerson} with length ${namePerson.length} `);
      offset += buf.write(namePerson, offset, 'ascii'); // Returns the length of stuff writen
      logger.debug(`write string offset ${offset}`);
      offset = buf.writeDoubleLE(amountPaid, offset);
      logger.debug(`write double ${amountPaid} offset ${offset}`);
      if (mapExpected.has(namePerson)) {
        mapExpected.set(namePerson, mapExpected.get(namePerson) + amountPaid);
      } else {
        mapExpected.set(namePerson, amountPaid);
      }
      totalBytesWritten += offset;
      await writeWithBackPressure(stream, buf.slice(0, offset));
      //await new Promise((resolve) =>
      // stream.write(buf.slice(0, offset), resolve),
      //);
    }
    logger.info(`total bytes Written ${totalBytesWritten}`);
    await new Promise((resolve) => {
      stream.end(resolve);
    });
  }, 500000);
  it('test that function works', async () => {
    const mapRecieved = await findUsersTotalAmountPaid(fileName);
    expect(mapExpected.entries.length).toBe(mapRecieved.entries.length);
    mapExpected.forEach((value, key) => {
      expect(mapRecieved.get(key)).toEqual(value);
    });
  }, 5000000);
});
