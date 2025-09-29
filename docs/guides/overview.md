# Overview

## Why Thiran?

Thiran builds on and expands the principles of the [Twelve-Factor App](https://12factor.net/config).
Modern applications need more than just `.env` loading.
They require flexible and powerful configuration systems that can adapt to various environments, support hierarchical overrides, and facilitate runtime decisions.

### Hierarchical Merging & Overrides

Real-world applications deal with multiple layers of configuration. This gets complicated as the applications expand its support to Multitenancy. Thiran allows hierarchical merging of configuration files so that:

Common configurations stay DRY. (e.g.) Consider following YAML configurations

Base config file:

```yaml
auth:
    base-path: https://auth-server-dev
```

Tenant specific config file

```yaml
tenant:
    tenant-a: ${auth.base-path}/tenant-a
    tenant-b: ${auth.base-path}/tenant-b 
```

Resultant config:
```ts
{
    auth: {
        basePath: "https://auth-server-dev"
    },
    tenant: {
        tenantA: "https://auth-server-dev/tenant-a",
        tenantB: "https://auth-server-dev/tenant-b"
    }
}
```
Developers gain predictable and structured config composition

> [!NOTE]
> `SCREAMING_SNAKE_CASE` and `kebab-case` are supported interchangeably. The keys are converted to `camcelCase` internally.
For more details, refer to [loaders](/guides/concepts/loader).


### Goes Beyond Twelve-Factor App

> The twelve-factor app stores config in environment variables (often shortened to env vars or env). Env vars are easy to change between deploys without changing any code

Thiran enhances this principle by:

- Supporting structured formats (YAML, JSON)
- Enabling dynamic resolution with value expansion (e.g.)
```yaml
database:
    schema: ${SCHEMA}
```
The value for `SCHEMA` is substituted from environment variables
- Environment-specific values cleanly override defaults

### What else?

- Allowing *config hydration* before validation — useful for secrets, IAM, Vault, etc.
- Providing runtime schema validation for safer, production-ready configurations

