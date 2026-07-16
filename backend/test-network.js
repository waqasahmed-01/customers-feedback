const net = require("net");

const socket = net.createConnection(
  {
    host: "smtp-relay.brevo.com",
    port: 465,
    timeout: 10000,
  },
  () => {
    console.log("✅ TCP connection established");
    socket.end();
    process.exit(0);
  },
);

socket.on("timeout", () => {
  console.log("❌ TCP connection timeout");
  socket.destroy();
  process.exit(1);
});

socket.on("error", (err) => {
  console.log("❌ TCP error:", err);
  process.exit(1);
});
