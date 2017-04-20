import * as Express from "express";
import * as http from "http";
import Configuration from "./configuration";
import Proxy from "./proxy";

export default class Server {

    public readonly app: Express.Application;
    public readonly httpServer: http.Server;

    static $inject = [
        "configuration",
        "proxy"
    ];
    constructor(
        private configuration: Configuration,
        private proxy: Proxy
    ) {
        this.app = Express();
        this.httpServer = http.createServer(this.app);

        this.app.use("/", Express.static(__dirname+"/../../client/"));
        this.app.get("/proxy", this.handleProxy());
    }

    handleProxy(): Express.RequestHandler {
        return (req, res, next) => {
            this.proxy.pipe(req, res);
        }
    }

    listen(): Promise<any> {
        console.log("listen on "+this.configuration.port);
        if (this.httpServer.listening) {
            return Promise.resolve();
        }
        else {
            return new Promise<void>((resolve, reject) => {
                this.httpServer.listen(this.configuration.port, (error: Error) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve();
                    }
                });
            });
        }
    }
}
