declare const ROLE_CUSTOM: string;

interface SpawnRoleOpts {
  body: string[];
}

interface Room {
  spawnRole(id: string, role: string, opts: SpawnRoleOpts, memory: any): void;
}

declare const _: any;

interface SpawnRegister {
    [s: string]: {
        room: string,
        body: string[],
        memory: any
    };
}

interface SpawnQueueItem {
    memory: {
        _id: string
    };
}

declare function registerPosisProcess(imageName: string, constructor: new () => IPosisProcess): boolean;
declare function queryPosisInterface<TQI extends IPosisExtension>(interfaceId: string): TQI | undefined;
