import * as nconf from "nconf";
import * as fs from "fs";
import Injection from "sinjection";
import Configuration from "./app/configuration";
import Proxy from "./app/proxy";
import Server from "./app/server";

nconf.env().argv().defaults({
    port: 8080
});

var injection = new Injection();

injection.set("configuration", Configuration);
injection.set("proxy", Proxy);
injection.set("server", Server);

injection.build();
process.title = "simex";

let promises: Promise<void>[] = [];

Promise.all(promises)
.then(() => injection.get<Server>("server").listen())
.catch((error: Error) => {
    console.log(error);
});
