/**
 * @typedef {{ setup?: (params: { configs: any, resources: any, secrets: any }) => any } | Record<any, any>} Component
 * @typedef {Record<string, Component>} Components
 * 
 * @typedef {{ run: (params: { configs: any, resources: any, secrets: any }) => any }} AppInterface
 * @typedef {Record<string, AppInterface>} Interfaces
 * 
 * @typedef {object} Configs
 * @property {ComponentConfigs=} components
 * @property {InterfaceConfigs=} interfaces
 * 
 * @typedef {Record<string, any>} ComponentConfigs
 * @typedef {Record<string, any>} InterfaceConfigs
 * 
 * @typedef {object} Resources
 * @property {ComponentResources=} components
 * @property {InterfaceResources=} interfaces
 * 
 * @typedef {Record<string, any>} ComponentResources
 * @typedef {Record<string, any>} InterfaceResources
 * 
 * @typedef {object} Secrets
 * @property {ComponentSecrets=} components
 * @property {InterfaceSecrets=} interfaces
 * @typedef {Record<string, any>} ComponentSecrets
 * @typedef {Record<string, any>} InterfaceSecrets
 */
export default class App {
  /**
   * @param {object} params
   * @param {Components=} params.components
   * @param {Interfaces} params.interfaces
   * 
   * @param {Configs=} params.configs
   * @param {Resources=} params.resources
   * @param {Secrets=} params.secrets
   */
  async run({
    components,
    interfaces,

    configs,
    resources,
    secrets
  }) {
    if (components != null) {
      await this.#setup({
        components,

        configs: configs?.components,
        resources: resources?.components,
        secrets: secrets?.components
      });
    }

    await this.#runInterfaces({
      interfaces,

      configs: configs?.interfaces,
      resources: resources?.interfaces,
      secrets: secrets?.interfaces
    });
  }

  /**
   * @param {object} params
   * @param {Components} params.components
   * 
   * @param {ComponentConfigs=} params.configs
   * @param {ComponentResources=} params.resources
   * @param {ComponentSecrets=} params.secrets
   */
  async #setup({
    components,

    configs,
    resources,
    secrets
  }) {
    await Promise.allSettled(
      Object.entries(components).map(
        ([componentName, component]) => {
          const componentConfigs = configs?.[componentName];
          const componentResources = resources?.[componentName];
          const componentSecrets = secrets?.[componentName];

          component.setup?.({
            configs: componentConfigs,
            resources: componentResources,
            secrets: componentSecrets
          });
        }
      )
    );
  }

  /**
   * @param {object} params
   * @param {Interfaces} params.interfaces
   * 
   * @param {InterfaceConfigs=} params.configs
   * @param {InterfaceResources=} params.resources
   * @param {InterfaceSecrets=} params.secrets
   */
  async #runInterfaces({
    interfaces,

    configs,
    resources,
    secrets
  }) {
    await Promise.allSettled(
      Object.entries(interfaces).map(([interfaceName, appInterface]) => {
        const interfaceConfigs = configs?.[interfaceName];
        const interfaceResources = resources?.[interfaceName];
        const interfaceSecrets = secrets?.[interfaceName];

        return appInterface.run({
          configs: interfaceConfigs,
          resources: interfaceResources,
          secrets: interfaceSecrets
        });
      })
    );
  }
}
