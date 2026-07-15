const dns = require("dns");

dns.lookup("smtp-relay.brevo.com", (err, address, family) => {
  if (err) {
    console.error("DNS Error:", err);
  } else {
    console.log("Resolved:", address, "IPv" + family);
  }
});
