# Overview

Following is the overview of steps in this library

```mermaid
flowchart TB

    Loader["Load and merge configurations"] --> Transformer["Replaces the value in config"] --> Hydration["Hydrate the configuration (if required)"] --> Validation["Validate the config with Standard Schema"]

```

## Loader

- This is responsible for loading the configuration from corresponding files
- Merge multiple configurations into one
    - During merging, the last file always has the precedence over the first
- Camel case the Kebab case keys
- For example, consider the following two YAMLs
    ```yaml
    # YAML-1
    app:
        port: 3000
        log-levels: debug
    ```
    ```yaml
    # YAML-2
    app:
        log-levels: log
    ```
    After merging, the config looks like the following
    ```json
    {
        "app": {
            "port": 3000
            "logLevels": "debug"
        }
    }
    ```


```mermaid
flowchart BT
    subgraph YAMLLoaderSubgraph["YAML Loader"]
        direction RL
        YamlLib["yaml loader library"] <--> YamlLoaderStrategy["Yaml Loader Strategy"]
    end
    subgraph JSONLoaderSubgraph["JSON Loader"]
        direction RL
        FileReader["File Reader and parser"] <--> JsonLoaderStrategy["JSON Loader Strategy"]
    end
    subgraph Loader["Loader"]
        direction TB
        LoaderManager["Loader Manager"] <--> FileExtension@{ shape: diam, label: "File Extension"}
        YAMLLoaderSubgraph
        JSONLoaderSubgraph
        FileExtension <-- .yaml or .yml --> YAMLLoaderSubgraph
        FileExtension <-- .json --> JSONLoaderSubgraph
        FileExtension <-- Other file extensions --> throwError["Throw error"]
        LoaderManager <-- Merge configs based on the current profile --> Merger
    end
    ConfigLoader["Configuration loader"] -- Initialize Loading --> Loader
    Loader -- Loaded/Merged configuration --> ConfigLoader
```
