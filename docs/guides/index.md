# Thiran

**Thiran** (திறன் - efficiency in [Tamil](https://en.wikipedia.org/wiki/Tamil_language)) is a Spring inspired flexible and efficient configuration manager.
It supports loading, merging, config hydration and validation with bring your own validator that supports [Standard Schema](https://standardschema.dev/).

## Installation
### Prerequisite

- [Node.js](https://nodejs.org) version 22 or higher.

Thiran can be added into existing project with

::: code-group

```sh [npm]
npm add thiran
```

```sh [yarn]
yarn add thiran
```

```sh [pnpm]
pnpm add thiran
```

:::

## How to use

- Make sure to include following environment variables based on the use case

```dotenv
# defaults to /config in root file
# If all the configurations are placed in ./config, no need to soecify this env variable
config.baseLocation=/config

# defaults to application.yaml in /config folder
# If application.yaml is placed in config.baseLocation, no need to specify this env variable.
config.file=application.yaml

# for additinoal files, include the file names. For multiple files, it can be comma seperated
# These configration files are expected to be in config.baseLocation
# If no additional files are required to be merged, no need to specify this env variable
config.additionalFiles=

# active profile to be picked up from configuration file
# defaults to `default` profile. To include multiple profiles, list profiles with comma seperated values
# If no other profiles apart from default are required, no need to specify this variable
profiles.active=
```

The above env variables can also be represented in different ways.
For more details, refer [here](/guides/concepts/loader.html#environment-variables)

- Once the base location, base configuration files and additional configuration files are decided, make sure to include the following in the configuration file

```yaml
...
config:
  activate:
    on-profile: 
...
```
For more details, refer [here](/guides/concepts/loader.html#configuration-file)

- Once the configuration file is finalized, start the application as below

```typescript
const configManager = new ConfigManager({
    // validation schema that supports standard schema
    validationSchema: validation,
    hooks: {
        beforeValidate(config) {
            // if additional configuration needs to be added to the existing
            return config;
        },
    },
});

configManager.load().then((config) => {
    // start the server
})
```

For details on how to use, refer to examples