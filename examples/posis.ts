// 


class SpawnExtension implements IPosisExtension, IPosisSpawnExtension {
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
    isValid(id: string): boolean {
        if (!this.register[id]) return false;
        let room: Room = Game.rooms[this.register[id].room];
        return !!room.memory.spawnQueue.find((item: SpawnQueueItem) => item.memory._id === id);
    }
    hasSpawned(id: string): boolean {
        return !!this.getCreep(id);
    }
    getCreep(id: string): Creep | undefined {
        return _.find(Game.creeps, (c: Creep) => c.memory._id === id) || undefined;
    }
}

let spawnExtension: any = new SpawnExtension();

// For querying extension interfaces (instead of tying ourselves to "levels")
global.queryPosisInterface = function<TQI extends IPosisExtension>(interfaceId: string): IPosisExtension & TQI | undefined {
    if (interfaceId === "spawn-v1") return spawnExtension;
    return;
};
global.registerPosisProcess = function(imageName: string, constructor: any): boolean {
    return true;
};

export abstract class PosisBaseProcess implements IPosisProcess {
    memory: any;
    imageName: string;
    id: PosisPID;
    parentId: PosisPID;
    log: IPosisLogger;
    abstract run(): void;
}

function RandomIDGenerator(): string {
    return Math.random().toString().slice(2);
}