<h1 style="text-align: center">
    <img alt="Thiran logo" height=50 width=50 src="./thiran.png"/>
    <br />
    Thiran
</h1>
<p style="text-align: center">
    A Spring inspired configuration manager
</p>
<div style="text-align: center">

[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=thiran&metric=coverage)](https://sonarcloud.io/summary/overall?id=thiran&branch=main) [![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=thiran&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=thiran)

</div>

**Thiran** (திறன் - prowess in [Tamil](https://en.wikipedia.org/wiki/Tamil_language)) is a Spring inspired flexible configuration manager.
It supports loading, merging, hydrating and validating configuration with bring your own validator that supports [Standard Schema](https://standardschema.dev/).

## Why Thiran

Modern applications need more than just `.env` loading. They need flexible and powerful configuration systems that adapt to environments, support hierarchical overrides, and enable runtime decisions. Thiran builds on and expands the principles of the [Twelve-Factor App](https://12factor.net/config), bringing them to the next level.

### Hierarchical Merging & Overrides

Real-world applications deal with multiple layers of configuration. This gets complicated as the applications expand it's support to Multitenancy. Thiran allows hierarchical merging of configuration files so that:

- Common configurations stay DRY
    - Reference config-path
    ```yaml
    auth:
        base-path: https://auth-server
    tenant:
        tenant-a: ${auth.base-path}/tenant-a 
    ```
    The value of `tenant-a` become `https://auth-server/tenant-a`

- Environment-specific values cleanly override defaults
- Developers gain predictable and structured config composition

For more details, refer to [overview](./docs/OVERVIEW.md)

### Goes Beyond Twelve-Factor App

> The twelve-factor app stores config in environment variables (often shortened to env vars or env). Env vars are easy to change between deploys without changing any code

Thiran enhances this principle by:

- Supporting structured formats (YAML, JSON)
- Enabling dynamic resolution with value expansion (e.g.,) 
    - Replacing value from environment variables
    ```yaml
    database:
        schema: ${SCHEMA}
    ```
    The value for `SCHEMA` is substituted from environment variables
- Allowing *config hydration* before validation — useful for secrets, IAM, Vault, etc.
- Providing runtime schema validation for safer, production-ready configurations
For more details, refer to [overview](./docs/OVERVIEW.md)


## What does Thiran enable?

- Multi-format config loader  
- Naming flexibility
- Environment profile support
- Configuration hydration & validation

For more details on the supported features, refer [here](./docs/FEATURES.md)

