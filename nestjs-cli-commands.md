# NestJS CLI Commands

## Install
```bash
npm install -g @nestjs/cli
npx @nestjs/cli@latest
```

## New project
```bash
nest new <name>
nest n <name>
```

## Generate
```bash
nest generate <schematic> <name>
nest g <schematic> <name>
```

### Schematics

| Schematic | Alias | Command |
|---|---|---|
| application | | `nest g app <name>` |
| library | lib | `nest g lib <name>` |
| class | cl | `nest g cl <name>` |
| controller | co | `nest g co <name>` |
| decorator | d | `nest g d <name>` |
| filter | f | `nest g f <name>` |
| gateway | ga | `nest g ga <name>` |
| guard | gu | `nest g gu <name>` |
| interface | itf | `nest g itf <name>` |
| interceptor | itc | `nest g itc <name>` |
| middleware | mi | `nest g mi <name>` |
| module | mo | `nest g mo <name>` |
| pipe | pi | `nest g pi <name>` |
| provider | pr | `nest g pr <name>` |
| resolver | r | `nest g r <name>` |
| resource | res | `nest g res <name>` |
| service | s | `nest g s <name>` |

### DTOs
No dedicated schematic. Either comes bundled with `resource`, or generate manually as a class:
```bash
nest g resource <name>
nest g cl <name>/dto/create-<name>.dto --no-spec --flat
nest g cl <name>/dto/update-<name>.dto --no-spec --flat
```

### Generate options
```bash
--dry-run    # -d, preview only
--flat       # no subfolder for the element
--no-spec    # skip .spec test file
--project    # -p, target project in a monorepo
```

## Build
```bash
nest build
nest build --watch
nest build --builder swc
```

## Start
```bash
nest start
nest start --watch
nest start --debug --watch
```

## Add library
```bash
nest add <name>
```

## Info
```bash
nest info
nest i
```

## Help
```bash
nest --help
nest generate --help
```