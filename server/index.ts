import next from 'next';
import { config } from 'node-config-ts';
import { createServer } from 'http';
import { job } from 'cron';

import { createTrainerHistoryTable, updateTrainerHistory } from './database';
import { logger } from './logger';

const isDev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev: isDev });
const nextHandler = nextApp.getRequestHandler();
const port = config.port || parseInt(process.env.PORT ?? '3000');

process.env.NEXTAUTH_URL = config.applicationURL;

// update leaderboard every day at 23:58
logger.info(`Current timezone used for the cron: "${Intl.DateTimeFormat().resolvedOptions().timeZone}"`);
job(
  '0 58 23 * * *',
  () => {
    void updateTrainerHistory();
  },
  null,
  true,
  Intl.DateTimeFormat().resolvedOptions().timeZone,
);

async function bootstrap() {
  try {
    await Promise.all([nextApp.prepare(), createTrainerHistoryTable()]);

    createServer((request, response) => {
      nextHandler(request, response);
    }).listen(port, () => {
      logger.info(`> Ready on http://localhost:${port}`);
    });
  } catch (err) {
    logger.fatal(err);
  }
}

void bootstrap();
