import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

export const frontSocket = io();
export const SocketContext = createContext();
