import { Socket } from "socket.io";

//global functions
declare function setCookie(username: string, type: string): Promise<{ status: boolean, encryptUser: string }>;
declare function replaceSlashWithUnderscore(inputString: string): string;

//lobby name reference
declare let lobby_playerName: string;

//libraries
declare var socket: Socket;