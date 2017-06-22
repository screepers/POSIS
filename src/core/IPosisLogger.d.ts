interface IPosisLogger {
    // because sometimes you don't want to eval arguments to ignore them
    debug(message: (() => string) | string): void;
    info(message:  (() => string) | string): void;
    warn(message:  (() => string) | string): void;
    error(message: (() => string) | string): void;
}
