import { IPosisKernel } from "../core";
import { PosisBaseProcess, queryPosisInterface, registerPosisProcess } from "./posis";

class ExampleProcess extends PosisBaseProcess {
  run () {
    let kernel: IPosisKernel = queryPosisInterface<IPosisKernel>("baseKernel");
    let child = kernel.startProcess(this, "AGS/AnotherProcess", {
      msg: "Hello World!"
    });
    kernel.setParent(child.id);
    kernel.killProcess(this.id); // Removed exit code
  }
}
class AnotherProcess extends PosisBaseProcess {
  run() {
    let kernel: IPosisKernel = queryPosisInterface<IPosisKernel>("baseKernel");
    let parent = kernel.getProcessById(this.parentId);
    this.log.info(`TICK! ${Game.time} ${this.memory.msg}`);
  }
}
// class YetAnotherProcess extends PosisBaseProcess {
//   run() {
//     let IPC = queryPosisInterface("ipc");
//     if (!IPC){
//       return queryPosisInterface<IPosisKernel>("baseKernel").killProcess(this.id);
//     }
//     IPC.call(0, "someMethod or whatever");
//   }
// }
registerPosisProcess("AGS/ExampleProcess", ExampleProcess);
registerPosisProcess("AGS/AnotherProcess", AnotherProcess);
// registerPosisProcess("AGS/YetAnotherProcess", YetAnotherProcess);


// In kernel or some other location for loading processes
// require("ags.example.js")