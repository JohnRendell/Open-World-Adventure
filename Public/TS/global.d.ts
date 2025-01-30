import { Socket } from "socket.io";

//global functions
declare function setCookie(username: string, type: string): Promise<{ status: boolean, encryptUser: string }>;
declare function replaceSlashWithUnderscore(inputString: String): string

//libraries
declare var socket: Socket;
declare var CryptoJS: any;