module.exports.initializeSocket = (io) => {
    let connections = [],
      users = [];
    
    io.on("connection", socket => {
      connections.push(socket);
    
      console.log("Connected: %s sockets connected", connections.length);
      socket.on("disconnect", data => {
        connections.splice(connections.indexOf(socket), 1);
        users.splice(users.indexOf(socket), 1);
        console.log("Disconnected: %s sockets", connections.length);
        updateSocket();
      });
    
      socket.on("test", data => {
        console.log(data);
      });
    
      const updateSocket = () => {
        io.emit("all-users", users);
      };
    });
}