import * as childProcess from 'child_process';
import * as util from 'util';
import { logger } from '../utils';

function streamToString(stream): Promise<string> {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('error', (err) => reject(err));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
}

describe('Child Processes Test', () => {
  it('launch new process using execSync', async () => {
    // This one uses shell to parse command line so you can pass args as u would have done in a shell
    // execFileSync does not work like that.
    const listing = childProcess.execSync('node --version');
    // execFileSync does not so args need to passed as seperate args
    const version = listing.toString();
    expect(version).toBeDefined();
    expect(version[0]).toBe('v');
    logger.info(`node version ${version}`);
  });

  it('launch new process using execFileSync', async () => {
    // This one does not use shell to parse command line
    const listing = childProcess.execFileSync('node', ['--version']);
    // execFileSync does not so args need to passed as seperate args
    const version = listing.toString();
    expect(version).toBeDefined();
    expect(version[0]).toBe('v');
    logger.info(`node version ${version}`);
  });

  it('launch new process using exec', async () => {
    // This one uses shell to parse command line
    const exec = util.promisify(childProcess.exec);
    const listing = await exec('node --version');

    // execFileSync does not so args need to passed as seperate args
    const version = listing.stdout.toString();
    expect(version).toBeDefined();
    expect(version[0]).toBe('v');
    logger.info(`node version ${version}`);
  });

  it('launch new process using spawn', async () => {
    // spwan is used for processess which run for long time.
    const emitter = childProcess.spawn('node', ['--version']);
    const version = await streamToString(emitter.stdout);
    await new Promise((resolve, reject) => {
      emitter.on('exit', (code) => {
        if (code != 0) {
          reject(`Process failed with error code ${code}`);
        } else {
          resolve(null);
        }
      });
    });

    expect(version).toBeDefined();
    expect(version[0]).toBe('v');
    logger.info(`node version ${version}`);
  });

  it('launch new process using spawn which fails', async () => {
    const emitter = childProcess.spawn('node', ['./no-exists.ts']);
    const message = await streamToString(emitter.stdout);
    const messageErr = await streamToString(emitter.stderr);
    logger.info(messageErr);
    expect(message).toBe('');
    expect(messageErr.length).toBeGreaterThan(5);
    const methodThatThrows = async () => {
      await new Promise((resolve, reject) => {
        emitter.on('exit', (code) => {
          if (code != 0) {
            reject(`Process failed with error code ${code}`);
          } else {
            resolve(null);
          }
        });
      });
    };
    expect(methodThatThrows()).rejects.toBe('Process failed with error code 1');
  });

  it('launch new process using fork', async () => {
    // fork takes another js
    const child = childProcess.fork(`${__dirname}/child.js`);
    child.send({ x: 4, y: 3 });
    const hypo = await new Promise((resolve) => {
      child.on('message', (message: any) => {
        logger.info(message);
        resolve(message);
        child.disconnect();
      });
    });

    expect(hypo).toBe(5);
  });
});
