// 

global.registerPosisProcess = function(imageName: string, constructor: any): boolean {
    return true;
};
let spawnExtension: SpawnExtension = new SpawnExtension();
// For querying extension interfaces (instead of tying ourselves to "levels")
global.queryPosisInterface = function<TQI extends IPosisExtension>(interfaceId: string): TQI | undefined {
    if (interfaceId === "spawn-v1") return spawnExtension;
    return;
};

export abstract class PosisBaseProcess implements IPosisProcess {
    memory: any;
    imageName: string;
    id: PosisPID;
    parentId: PosisPID;
    log: IPosisLogger;
    abstract run(): void;
}

// An implementation of IPosisSpawnExtension on my (ags) codebase, feel free to ignore....

interface SpawnRegister {
    [s: string]: {
        room: string,
        body: string[],
        memory: any
    };
}

class SpawnExtension implements IPosisSpawnExtension {
    private register: SpawnRegister = {};
    spawnCreep(sourceRoom: string, targetRoom: string, body: string[], memory: any): string {
        let room: Room = Game.rooms[sourceRoom];
        let id: string = RandomIDGenerator();
        memory._id = id;
        this.register[id] = { room: sourceRoom, body, memory };
        room.spawnRole(id, ROLE_CUSTOM, { body: body }, memory);
        return id;
    }
    // Dirty hacky examples below....
    isValid(id): boolean {
        if (!this.register[id]) return false;
        let room = Game.rooms[this.register[id].room];
        return !!room.memory.spawnQueue.find(item => item.memory._id === id);
    }
    hasSpawned(id: string): boolean {
        return !!this.getCreep(id);
    }
    getCreep(id: string): Creep | undefined {
        return _.find(Game.creeps, c => c.memory._id === id) || undefined;
    }
}

function RandomIDGenerator(): string {
    return Math.random().toString().slice(2);
}