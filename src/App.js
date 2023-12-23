/**
 * @typedef {{ setup?: (params?: { configs: unknown, resources: unknown }) => any }} Component
 * @typedef {Record<string, Component>} Components
 * 
 * @typedef {{ run: (params?: { configs: unknown, resources: unknown }) => any }} AppInterface
 * @typedef {Record<string, AppInterface>} Interfaces
 * 
 * @typedef {object} Configs
 * @property {ComponentConfigs=} components
 * @property {InterfaceConfigs=} interfaces
 * 
 * @typedef {Record<string, unknown>} ComponentConfigs
 * @typedef {Record<string, unknown>} InterfaceConfigs
 * 
 * @typedef {object} Resources
 * @property {ComponentResources=} components
 * @property {InterfaceResources=} interfaces
 * 
 * @typedef {Record<string, unknown>} ComponentResources
 * @typedef {Record<string, unknown>} InterfaceResources
 * 
 */

/**
 * @typedef {object} AppParams
 * @property {Components} components
 * @property {Interfaces} interfaces
 * 
 * @property {Configs=} configs
 * @property {Resources=} resources
 */
export default class App {
  /** @type {Components} */
  #components;

  /** @type {Interfaces} */
  #interfaces;

  /** @type {Configs=} */
  #configs;

  /** @type {Resources=} */
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

    await this.#setup({
      components,
      configs: configs?.components,
      resources: resources?.components
    });

    await this.#runInterfaces({
      interfaces,
      configs: configs?.interfaces,
      resources: resources?.interfaces
    });
  }

  /**
   * @param {object} params
   * @param {Components} params.components
   * @param {ComponentConfigs=} params.configs
   * @param {ComponentResources=} params.resources
   */
  async #setup({ components, configs, resources }) {
    await Promise.allSettled(
      Object.entries(components).map(
        ([componentName, component]) => {
          const componentConfigs = configs?.[componentName];
          const componentResources = resources?.[componentName];

          component.setup?.({
            configs: componentConfigs,
            resources: componentResources
          });
        }
      )
    );
  }

  /**
   * @param {object} params
   * @param {Interfaces} params.interfaces
   * @param {InterfaceConfigs=} params.configs
   * @param {InterfaceResources=} params.resources
   */
  async #runInterfaces({ interfaces, configs, resources }) {
    await Promise.allSettled(
      Object.entries(interfaces).map(([interfaceName, appInterface]) => {
        const interfaceConfigs = configs?.[interfaceName];
        const interfaceResources = resources?.[interfaceName];

        return appInterface.run({
          configs: interfaceConfigs,
          resources: interfaceResources
        });
      })
    );
  }
}
