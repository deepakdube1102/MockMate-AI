import mongoose from 'mongoose';
import dns from 'dns';

// Custom lookup function that uses dns.resolve4 (respects setServers) instead of default dns.lookup (uses OS cache/glibc getaddrinfo)
const customLookup = (hostname, options, callback) => {
  dns.resolve4(hostname, (err, addresses) => {
    if (err) {
      // Fallback to standard dns.lookup if resolve4 fails (e.g. localhost, local domains)
      return dns.lookup(hostname, options, callback);
    }
    
    if (options.all) {
      const results = addresses.map(addr => ({ address: addr, family: 4 }));
      return callback(null, results);
    }
    return callback(null, addresses[0], 4);
  });
};

const connectDB = async () => {
  try {
    // Resolve DNS issues with SRV records on Node.js (Windows)
    try {
      dns.setServers(['8.8.8.8', '8.8.4.4']);
    } catch (dnsErr) {
      console.warn('⚠️ Custom DNS configuration failed, proceeding with default:', dnsErr.message);
    }

    console.log('🔌 Connecting to MongoDB Atlas...');
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 4000, // 4 seconds timeout
      lookup: customLookup
    });
    console.log(`🔌 MongoDB Connected (Atlas): ${conn.connection.host}`);
    global.dbConnected = true;
  } catch (error) {
    console.error(`❌ MongoDB Atlas Connection Failed: ${error.message}`);
    
    try {
      console.log('🔌 Trying to connect to Local MongoDB (mongodb://localhost:27017)...');
      const localConn = await mongoose.connect('mongodb://localhost:27017/mockmate', {
        serverSelectionTimeoutMS: 2000 // 2 seconds timeout
      });
      console.log(`🔌 MongoDB Connected (Local): ${localConn.connection.host}`);
      global.dbConnected = true;
    } catch (localError) {
      console.error(`❌ Local MongoDB Connection Failed: ${localError.message}`);
      console.warn('⚠️ BOTH remote Atlas and local localhost databases are unreachable.');
      console.warn('⚙️ Activating STATEFUL IN-MEMORY SERVER MODE. MockMate is fully usable and offline-functional!');
      global.dbConnected = false;
      
      // Prevent Mongoose from hanging on buffering commands
      mongoose.set('bufferCommands', false);
    }
  }
};

export default connectDB;
