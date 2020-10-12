export enum ConfigProperties {
  APPLICATION_ID,
  BOOTSTRAP_SERVERS
}

export interface Config {
  [ConfigProperties.APPLICATION_ID]: string;
  [ConfigProperties.BOOTSTRAP_SERVERS]: string | string[];
}
