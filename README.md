test-agent
=================

A new CLI generated with oclif


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/test-agent.svg)](https://npmjs.org/package/test-agent)
[![Downloads/week](https://img.shields.io/npm/dw/test-agent.svg)](https://npmjs.org/package/test-agent)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g test-agent
$ test-agent COMMAND
running command...
$ test-agent (--version)
test-agent/0.0.0 darwin-arm64 node-v22.12.0
$ test-agent --help [COMMAND]
USAGE
  $ test-agent COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`test-agent hello PERSON`](#test-agent-hello-person)
* [`test-agent hello world`](#test-agent-hello-world)
* [`test-agent help [COMMAND]`](#test-agent-help-command)
* [`test-agent plugins`](#test-agent-plugins)
* [`test-agent plugins add PLUGIN`](#test-agent-plugins-add-plugin)
* [`test-agent plugins:inspect PLUGIN...`](#test-agent-pluginsinspect-plugin)
* [`test-agent plugins install PLUGIN`](#test-agent-plugins-install-plugin)
* [`test-agent plugins link PATH`](#test-agent-plugins-link-path)
* [`test-agent plugins remove [PLUGIN]`](#test-agent-plugins-remove-plugin)
* [`test-agent plugins reset`](#test-agent-plugins-reset)
* [`test-agent plugins uninstall [PLUGIN]`](#test-agent-plugins-uninstall-plugin)
* [`test-agent plugins unlink [PLUGIN]`](#test-agent-plugins-unlink-plugin)
* [`test-agent plugins update`](#test-agent-plugins-update)

## `test-agent hello PERSON`

Say hello

```
USAGE
  $ test-agent hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ test-agent hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/dev/test-agent/blob/v0.0.0/src/commands/hello/index.ts)_

## `test-agent hello world`

Say hello world

```
USAGE
  $ test-agent hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ test-agent hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/dev/test-agent/blob/v0.0.0/src/commands/hello/world.ts)_

## `test-agent help [COMMAND]`

Display help for test-agent.

```
USAGE
  $ test-agent help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for test-agent.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.33/src/commands/help.ts)_

## `test-agent plugins`

List installed plugins.

```
USAGE
  $ test-agent plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ test-agent plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.48/src/commands/plugins/index.ts)_

## `test-agent plugins add PLUGIN`

Installs a plugin into test-agent.

```
USAGE
  $ test-agent plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into test-agent.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the TEST_AGENT_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the TEST_AGENT_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ test-agent plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ test-agent plugins add myplugin

  Install a plugin from a github url.

    $ test-agent plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ test-agent plugins add someuser/someplugin
```

## `test-agent plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ test-agent plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ test-agent plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.48/src/commands/plugins/inspect.ts)_

## `test-agent plugins install PLUGIN`

Installs a plugin into test-agent.

```
USAGE
  $ test-agent plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into test-agent.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the TEST_AGENT_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the TEST_AGENT_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ test-agent plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ test-agent plugins install myplugin

  Install a plugin from a github url.

    $ test-agent plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ test-agent plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.48/src/commands/plugins/install.ts)_

## `test-agent plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ test-agent plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ test-agent plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.48/src/commands/plugins/link.ts)_

## `test-agent plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ test-agent plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ test-agent plugins unlink
  $ test-agent plugins remove

EXAMPLES
  $ test-agent plugins remove myplugin
```

## `test-agent plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ test-agent plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.48/src/commands/plugins/reset.ts)_

## `test-agent plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ test-agent plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ test-agent plugins unlink
  $ test-agent plugins remove

EXAMPLES
  $ test-agent plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.48/src/commands/plugins/uninstall.ts)_

## `test-agent plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ test-agent plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ test-agent plugins unlink
  $ test-agent plugins remove

EXAMPLES
  $ test-agent plugins unlink myplugin
```

## `test-agent plugins update`

Update installed plugins.

```
USAGE
  $ test-agent plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.48/src/commands/plugins/update.ts)_
<!-- commandsstop -->
