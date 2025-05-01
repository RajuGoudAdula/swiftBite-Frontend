import { io } from 'socket.io-client';

// Set up the socket connection
const socket = io("https://swiftbite-backend-production.up.railway.app", {
  withCredentials: true,
  transports: ['websocket'],
});

// Utility function to register user for notifications
export const registerUserForNotifications = async (userId , role) => {
  socket.emit('register', { userId ,role});
};

// Listen for incoming notifications
export const listenForNotifications = (callback) => {
  socket.on('new_notification', (notification) => {
    console.log(notification);
    callback(notification);
  });
};

// Disconnect the socket when not needed (e.g., component unmount)
export const disconnectSocket = () => {
  socket.disconnect();
};

export default socket;
