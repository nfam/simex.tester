import * as nconf from "nconf";

export default class Configuration {

    constructor() {
    }

    get port(): string {
        return nconf.get("port");
    }
}