import cron from 'node-cron';
import { fetchAndProcessJobs } from '../services/jobMarketService';

export function initScheduler() {
    // Run every 6 hours
    cron.schedule('0 */6 * * *', async () => {
        console.log('Running scheduled job market update...');
        await fetchAndProcessJobs();
    });

    // Run once on startup
    console.log('Initiating first-run job market update...');
    fetchAndProcessJobs().catch(console.error);
}
