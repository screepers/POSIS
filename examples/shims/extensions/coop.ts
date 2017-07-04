export default function shimCooperativeScheduling(coop?: IPosisCooperativeScheduling): IPosisCooperativeScheduling {
    if (!coop) {
        const now = Game.cpu.getUsed();
        coop = {
            budget: Game.cpu.limit - now,
            get used() {
                return Game.cpu.getUsed() - now;
            },
        }
    }
    if (!coop.wrap) {
        coop.wrap = function(makeIterator) {
            const iterator = makeIterator();
            let result = undefined;
            while (coop.used < coop.budget) {
                if (result && result.done) {
                    break;
                }
                result = iterator.next();
            }
            if (result && typeof result.value === 'function') {
                return result.value();
            }
        }
    }
    return coop;
}
