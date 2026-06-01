import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

// Configure Google Public DNS for DNS resolve methods
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (dnsErr) {
  console.warn('⚠️ Custom DNS configuration failed:', dnsErr.message);
}

dotenv.config();

// Custom lookup function that uses dns.resolve4 (respects setServers) instead of default dns.lookup (uses OS cache/glibc getaddrinfo)
const customLookup = (hostname, options, callback) => {
  dns.resolve4(hostname, (err, addresses) => {
    if (err) {
      // Fallback to standard dns.lookup if resolve4 fails (e.g. localhost)
      return dns.lookup(hostname, options, callback);
    }
    
    if (options.all) {
      const results = addresses.map(addr => ({ address: addr, family: 4 }));
      return callback(null, results);
    }
    return callback(null, addresses[0], 4);
  });
};

console.log('Testing MongoDB connection with Custom Lookup...');
console.log('URI:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 4000,
  lookup: customLookup
})
  .then(() => {
    console.log('✅ Success! Connected with custom DNS lookup resolver!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Connection Failed:', err.message);
    process.exit(1);
  });
