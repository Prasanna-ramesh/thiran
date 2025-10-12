# Loader

```mermaid
flowchart LR

    Loader --> Transformer --> Hydration --> Validation

    style Loader fill:#3178c6,stroke:#ffffff
```


Loader is responsible for loading the configuration from corresponding files. 
It merges multiple configurations into one and merges the resultant config with environment variables.
So the precedence is as follows <br>  `Environment variables > last config file > first config`.

Along with merging, loader converts the keys into camel case by default. For example, consider the following two YAMLs
```yaml
# YAML-1
app:
    port: 3000
    log-levels: debug
```
```yaml
# YAML-2
app:
    LOG-LEVELS: log
    new-feature: true
```
After merging, the config from loader is as follows.
```ts
{
    app: {
        port: 3000,
        logLevels: "log",
        newFeature: true
    }
}
```

## Camel case conversion

Given that [configuration is considered as a nested object](/guides/concepts/), the nested keys can be accessed with dot notation.
From the above example, `app.port` can yield `3000`. 

Since this library loads configuration from environment variables as well as YAML/JSON files, the keys can be in different cases.
So, `SCREAMING_SNAKE_CASE`, `kebab-case` and `camelCase` are supported.
Once loaded, all the keys can be accessed in camel case. 
This is done since *camel case is often used for properties in JavaScript/TypeScript*.

The following table shows how the keys are converted.

| Original Key           | Converted Key          |
|------------------------|------------------------|
| `SCREAMING_SNAKE_CASE` | `screaming.snake.case` |
| `SCREAMING_SNAKE-CASE` | `screaming.snakeCase`  |
| `kebab-case`           | `kebabCase`            |
| `camelCase`            | `camelCase`            |

> [!IMPORTANT]
> - If a key is in camel case already, it is not converted.
> - If a key is in `SCREAMING_SNAKE_CASE` containing only `_`, it is converted to camel case considering `_` as the separator.
> - If a key is in `SCREAMING_SNAKE-CASE` containing both `-` and `_`, it is converted to camel case considering `_` as the separator. The letter followed by `-` is capitalized.
> - If a key is in `kebab-case`, the letter followed by `-` is capitalized


## How loader selects a profile

### Environment Variables

The following environment variables are used by loader

| Environment variable                                                                                   | Description                                              | Default Value                                                                                                                                                                                           |
|--------------------------------------------------------------------------------------------------------|----------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `config.baseLocation` <br> or <br> `config.base-location` <br> or <br> `CONFIG_BASE-LOCATION`          | Folder where all the configuration files are available   | `./config` <br> (config folder in root)                                                                                                                                                                 |
| `config.file` <br> or <br> `CONFIG-FILE`                                                               | Base/default configuration file                          | `application.yaml`                                                                                                                                                                                      |
| `config.additionalFiles` <br> or <br> `config.additional-files` <br> or <br> `CONFIG_ADDITIONAL-FILES` | Additional configuration files to be merged with default | `undefined` <br /> If additional locations are provided, separate file names with `,`. <br> (e.g.) `application-tenant-a.yaml, application-tenant-b.yaml`                                               |
| `profiles.active` <br> or <br> `PROFILES_ACTIVE`                                                       | Active profile(s)                                        | `default` <br> For selecting multiple profiles, separate file names with `,` (e.g.) `default, dev` for selecting default and dev profile. In this case, dev profile has precedence over default profile |


The examples in the above translates to the following

```
.
├── config/                         <-- Base location
│   ├── application.yaml            <-- Default configuration file
│   ├── application-tenant-a.yaml   <-- Additional configuration file
│   └── application-tenant-b.yaml   <-- Additional configuration file
└── package.json
```
### Configuration file

Configuration file(s) can be either in YAML or JSON.
Each configuration file can have a single config or multiple configs.
The config is activated base on user selected profile which is set through `profiles.active` env variable.


For single profile

```yaml
...
config:
  activate:
    on-profile: dev # onProfile also works
...
```
In case if a config can be activated by multiple active profiles, the config file is as below

```yaml
...
config:
  activate:
    on-profile: dev, test # onProfile also works
...
```

For file with multiple configs

```yaml
...
config:
  activate:
    on-profile: dev # onProfile also works
...

---

...
config:
  activate:
    on-profile: prod # onProfile also works
...
```

> [!NOTE]
> - If `config.activate.on-profile` is not provided, it is considered as `default` profile
> - When `config.activate.on-profile` is missing in a multi-configuration file, every profile is considered as `default` and hierarchical merging applies
>   - In this case, the last configuration in that file has precedence over the first 

### Hierarchical merging
With the above, loader does the following

- It picks default configuration file and loads all the configuration into array of objects
- It also loads all the additional configuration files one by one and appends to the array of objects collected in the previous step
- From the collected configurations, the profiles that matches the active profiles are picked
- The selected configurations are then hierarchically merged into a single configuration
- The merged configuration is again merged with the environment variables

> [!IMPORTANT]
> For additional configuration files, the file at the end has more precedence that the first.