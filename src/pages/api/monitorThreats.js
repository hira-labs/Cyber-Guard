import axios from 'axios';
import { notifyThreat } from './socket';

const monitorThreats = async () => {
  // Simulate threat detection or API integration
  const ip = "192.168.1.100";  // Example suspicious IP

  try {
    const response = await axios.get(`https://api.abuseipdb.com/api/v2/check?ipAddress=${ip}`, {
      headers: {
        'Key': '618bccdde464689312ea47b2e5436f49561272b4c2f09535f3ff623d8d20253b0e9eeafb18b06983',
      },
    });

    const threatLevel = response.data.data.abuseConfidenceScore;

    if (threatLevel > 50) {
      notifyThreat({ ip, threatLevel, message: 'High risk IP detected!' });
    }
  } catch (error) {
    console.error('Error monitoring threats:', error);
  }
};

setInterval(monitorThreats, 5000);  // Check for threats every 5 seconds
