import { Socket } from "socket.io";

declare function replaceSlashWithUnderscore(inputString: string): string;
declare function setCookie(username: string, type: string): Promise<{ status: boolean, encryptUser: string }>;
declare function modalStatus(modalID: string, status: string, animationName: string): any;
declare var socket: Socket;
declare var CryptoJS: any;
declare var game_PlayerName: any;
declare function setOutWorld(status: boolean): any;