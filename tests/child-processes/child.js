process.on('message', (message) => {
  console.log(message);
  process.send(Math.hypot(message.x, message.y));
});
