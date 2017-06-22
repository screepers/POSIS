interface IPosisSpawnExtension {
    // Queues/Spawns the creep and returns an ID
    spawnCreep(sourceRoom: string, targetRoom: string, body: string[], memory: any): string;
    // Used to see if its been dropped from queue
    isValid(id: string): boolean;
    hasSpawned(id: string): boolean;
    getCreep(id: string): Creep | undefined;
}
