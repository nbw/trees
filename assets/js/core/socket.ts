import { Socket as PhxSocket } from "phoenix";

const setupSocket = (token: string) => {
  let socket = new PhxSocket("/socket", {
    params: { token: token },
  });
  socket.connect();
  return socket;
};

export const setupChannel = (token: string, name: string) => {
  const socket = setupSocket(token);
  return socket.channel(name, {});
};

export const setupChannelFromSocket = (socket, name: string) => {
  return socket.channel(name, {});
};

export const channelCallback = (
  channel,
  callback: string,
  fn: (payload: any) => void,
) => {
  channel.on(callback, fn);
};

export const channelJoin = (channel) => {
  channel
    .join()
    .receive("ok", (resp) => {
      console.log("Joined successfully", resp);
    })
    .receive("error", (resp) => {
      console.log("Unable to join", resp);
    });
};