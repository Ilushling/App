/**
 * @typedef {{ setup?: (params: any) => any }} Component
 * @typedef {Record<string, Component>} Components
 * 
 * @typedef {{ run: () => any }} AppInterface
 * @typedef {Record<string, AppInterface>} Interfaces
 * 
 * @typedef {Record<string, unknown>} Configs
 * @typedef {Record<string, unknown>} Resources
 */

/**
 * @typedef {object} AppParams
 * @property {Components} components
 * @property {Interfaces} interfaces
 * 
 * @property {Configs} configs
 * @property {Resources} resources
 */
export default class App {
  /** @type {Components} */
  #components;

  /** @type {Interfaces} */
  #interfaces;

  /** @type {Configs} */
  #configs;

  /** @type {Resources} */
  #resources;

  /** @param {AppParams} params */
  constructor({
    components,
    interfaces,

    configs,
    resources
  }) {
    this.#components = components;
    this.#interfaces = interfaces;

    this.#configs = configs;
    this.#resources = resources;
  }

  #getConfigs() {
    return this.#configs;
  }

  /**
   * @param {Configs} configs
   */
  setConfigs(configs) {
    this.#configs = configs;
  }


  #getResources() {
    return this.#resources;
  }

  /**
   * @param {Resources} resources
   */
  setResources(resources) {
    this.#resources = resources;
  }


  async run() {
    const components = this.#components;
    const interfaces = this.#interfaces;

    const configs = this.#getConfigs();
    const resources = this.#getResources();

    await this.#setup({ components, configs, resources });

    await this.#runInterfaces(interfaces);
  }

  /**
   * @param {object} params
   * @param {Components} params.components
   * @param {Configs} params.configs
   * @param {Resources} params.resources
   */
  async #setup({ components, configs, resources }) {
    await Promise.allSettled(
      Object.entries(components).map(
        ([componentName, component]) =>
          component?.setup?.({
            configs: configs[componentName],
            resources: resources[componentName]
          })
      )
    );
  }

  /**
   * @param {Interfaces} interfaces
   */
  async #runInterfaces(interfaces) {
    await Promise.allSettled(
      Object.values(interfaces).map(appInterface => appInterface.run())
    );
  }
}
