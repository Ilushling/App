import assert from 'node:assert';
import { describe, it } from 'node:test';

import App from '../src/App.js';

/**
 * @typedef {import('../src/App.js').Components} Components
 * @typedef {import('../src/App.js').Interfaces} Interfaces
 * @typedef {import('../src/App.js').Configs} Configs
 * @typedef {import('../src/App.js').Resources} Resources
 */

function createApp() {
  return new App();
}

describe('App', async () => {
  let aComponent = 0;
  let bComponent = 0;

  let aInterface = 0;
  let bInterface = 0;

  const components = /** @type {Components} */ ({
    aComponent: {
      setup: () => aComponent = 1
    },
    bComponent: {
      setup: () => bComponent = 2
    }
  });
  const interfaces = /** @type {Interfaces} */ ({
    aInterface: {
      run: () => aInterface = 1
    },
    bInterface: {
      run: () => bInterface = 2
    }
  });

  const configs = /** @type {Configs} */ ({});
  const resources = /** @type {Resources} */ ({});

  const app = createApp();

  await app.run({
    components,
    interfaces,

    configs,
    resources
  });

  it('Components setup', () => {
    assert.strictEqual(aComponent, 1);
    assert.strictEqual(bComponent, 2);
  });
  it('Interfaces run', () => {
    assert.strictEqual(aInterface, 1);
    assert.strictEqual(bInterface, 2);
  });
});
