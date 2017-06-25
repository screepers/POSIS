# POSIS
Portable Operating System Interface for Screeps

## Rationale
See [POSIX](https://en.wikipedia.org/wiki/POSIX).

## Basic general workflow

- Host OS loads a foreign bundle in its own way (usually an import somewhere)
- Host calls `install(registry: IPosisProcessRegistry)` on the bundle (see [IPosisBundle](./src/core/IPosisBundle.d.ts))
- Bundle registers all its processes by calling `registry.register(...)` for each of them (see [IPosisProcessRegistry](./src/core/IPosisProcessRegistry.d.ts)). This puts processes in host's general process registry (details are specific to particular host).
- Host starts one or more bundle's processes, possibly using optional `rootImageName` specified by the bundle.
- A bundle process gets constructed with `IPosisProcessContext` -- a host provided handler carrying memory accessor and other goodies. See [IPosisProcessContext](./src/core/IPosisProcess.d.ts).
- Eventually host runs the process by executing its `run()` method. See [IPosisProcess](./src/core/IPosisProcess.d.ts).
- Process queries [interfaces](##Extensions) that the host provides and uses them to do evil or launch more child processes.

## Writing compatibility layer

Host OS must provide at least `IPosisKernel` implementation, and ideally all other defined [extensions](##Extensions).

This project provides typescript interfaces that serve as is in typescript projects and as documentation for poor souls using plain JS.

To use types in typescript project, install `typings`
```
$ npm install typings --saveDev
```
Add or modify `typings.json` with 
```
{
  "name": "whatever",
  "globalDependencies": {
    "posis-api": "github:screepers/POSIS/dist/index.d.ts#master"
  }
}
```

Make sure typings are included in `tsconfig.json`
```
  "include": [
    "typings/**/*.d.ts"
   ]
```

## Writing compatible process 

For an example see [test bundle](./examples/bundles/test.bundle.ts).

## Extensions
### IPosisKernel

Base kernel, exposes ways to start/stop/reparent or find a process. [IPosisKernel](./src/core/IPosisKernel.d.ts)

### IPosisSpawnExtension

## Known posis bundles
