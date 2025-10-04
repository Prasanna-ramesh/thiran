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

Loader requires the following

| Config Name                            | Description                                                          | Environment variable                                                                                            | Default Value                                                                                                                                             |
|----------------------------------------|----------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| Base Location                          | Folder where all the configuration files are available               | `config.baseLocation` <br> or <br> `config.base-location` <br> or <br> `CONFIG_BASE-LOCATION`                   | `./config` (config folder in root)                                                                                                                        |
| Default configuration file                  | Base/default configuration file. This is the base on which additional files will be merged if provided.                                      | `config.file` <br> or <br> `CONFIG_LOCATION`                                                                | `application.yaml`                                                                                                                                        |
| Additional configuration files | Location of additional configuration files to be merged with default | `config.additionalFiles` <br> or <br> `config.additional-files` <br> or <br> `CONFIG_ADDITIONAL-FILES` | `undefined` <br /> If additional locations are provided, separate file names with `,`. <br> (e.g.) `application-tenant-a.yaml, application-tenant-b.yaml` |

The config from above table looks like following


```
.
├── config/                         <-- Base location
│   ├── application.yaml            <-- Default configuration file
│   ├── application-tenant-a.yaml   <-- Additional configuration file
│   └── application-tenant-b.yaml   <-- Additional configuration file
└── package.json
```


> [!IMPORTANT]
> For additional configuration files, the file at the end has more precedence that the first.