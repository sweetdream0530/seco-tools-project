import * as signalR from "@microsoft/signalr";
import { SignalRHost } from "./endpoints.const";

/***************************************
* Creates signal R connection for the model information data exchange
*/
export const connection = new signalR.HubConnectionBuilder()
    .withUrl(SignalRHost(), {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
    })
    .build();
