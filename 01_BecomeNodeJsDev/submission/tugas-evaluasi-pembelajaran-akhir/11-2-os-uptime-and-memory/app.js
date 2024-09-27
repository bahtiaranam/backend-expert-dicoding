const os = require('os');

setTimeout(() => {
  console.log(process.uptime()); // @TODO cetak uptime dari process
  console.log(os.uptime()); // @TODO cetak uptime dari sistem operasi
  console.log(os.totalmem()); // @TODO cetak total memori yang tersedia di sistem operasi
  console.log(process.memoryUsage().heapTotal); // @TODO cetak total heap memori
}, 1000);
