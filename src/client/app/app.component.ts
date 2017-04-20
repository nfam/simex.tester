import { Component, ViewChild, ElementRef, Input, Inject } from "@angular/core";
import { Http, ResponseContentType } from "@angular/http";
import { Expression, IProcessors } from "simex";

@Component({
    selector: "app",
    templateUrl: "app.component.html"
})

export class AppComponent {
    name = "Expression"

    processors: IProcessors;
    private _processorsText: string;

    expression: Expression;
    private _expressionText: string;

    inputUrl: string
    getting: boolean
    private _inputText: string

    output: string;

    constructor(@Inject(Http) private http: Http) {
        this.processors = undefined;
        this._processorsText = "";
        this.expression = undefined;
        this._expressionText = "";
        this.inputUrl = "";
        this.getting = false;
        this._inputText = "";
        this.output = "Please input expression";
    }

    set processorsText(value: string) {
        this._processorsText = value.trim();
        this.process("processors");
    }

    get processorsText(): string {
        return this._processorsText;
    }

    set expressionText(value: string) {
        this._expressionText = value.trim();
        this.process("expression");
    }

    get expressionText(): string {
        return this._expressionText;
    }

    set inputText(value: string) {
        this._inputText = value;
        this.process("input");
    }

    get inputText(): string {
        return this._inputText;
    }

    get() {
        this.getting = true;
        var url = this.inputUrl;
        if (window.location.protocol.startsWith("http")) {
            url = window.location.protocol+"//"+window.location.host+"/proxy?"+url;
        }

        this.http.request(url)
        .subscribe((resonse) => {
            this.inputText = resonse.text();
        }, (error) => {
            this.output = error;
        }, () => {
            this.getting = false;
        });
    }

    private process(event: "processors" | "expression" | "input") {
        if (event === "processors") {
            try {
                this.processors = eval(this._processorsText);
            }
            catch (error) {
                this.output = error.message+"\n"+error.stack;
                return;
            }
        }

        if (!this._expressionText) {
            this.output = "Please input expression";
            return;
        }

        if (event === "expression") {
            try {
                let json  = JSON.parse(this._expressionText);
                this.expression = new Expression(json, this.processors);
            }
            catch (error) {
                this.output = error.message+"\n"+error.stack;
                return;
            }
        }

        if (!this._inputText) {
            this.output = "Please input text";
            return;
        }

        try {
            let result = this.expression.extract(this._inputText);
            this.output = JSON.stringify(result, null, 2);
        }
        catch (error) {
            this.output = error.message+"\n"+error.stack;
        }
    }
}
