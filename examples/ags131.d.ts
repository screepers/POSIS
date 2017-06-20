declare const ROLE_CUSTOM: string;

interface SpawnRoleOpts {
  body: string[];
}

interface Room {
  spawnRole(id: string, role: string, opts: SpawnRoleOpts, memory: any): void;
}

declare const _: any;
