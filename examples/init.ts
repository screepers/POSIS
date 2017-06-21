
class Init implements IPosisProcess {
  memory: any; // private memory
  imageName: string; // image name (maps to constructor)
  id: PosisPID; // ID
  parentId: PosisPID; // Parent ID
  log: IPosisLogger; // Logger 
  get posisTest(): IPosisProcess | undefined {
    let kernel: IPosisKernel = queryPosisInterface("baseKernel") as IPosisKernel;
    if (!this.memory.posisTestId) return;
    return kernel.getProcessById(this.memory.posisTestId);
  }
  set posisTest(value: IPosisProcess) {
    this.memory.posisTestId = value.id;
  }
  run() {
    let kernel: IPosisKernel = queryPosisInterface("baseKernel") as IPosisKernel;
    let parent = kernel.getProcessById(this.parentId);
    this.log.info(`TICK! ${Game.time} ${this.memory.msg || "init"}`);
    if (!this.posisTest) {
      let child = kernel.startProcess("POSISTest/PosisBaseTestProcess", {
        maxRunTime: 5
      });
      this.posisTest = child;
    }
  }
}

registerPosisProcess("init", Init);