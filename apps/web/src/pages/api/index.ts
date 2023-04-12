import env from '@/env'
import Queue from 'bull'

const queue = new Queue('test', env.REDIS_URL!, {
  defaultJobOptions: {
    delay: 5000,
    removeOnComplete: true,
  },
  limiter: {
    max: 1,
    duration: 5000,
  },
})

const JOB_LIMIT = 1

const JOB_DELAY = 1000

queue
  .isReady()
  .then(() => {
    console.info(
      `[INIT] Report queue is connected to Redis at ${process.env.REDIS_URL}`
    )
    console.info(
      `[INIT] Job process is limited to ${JOB_LIMIT} job with delay ${JOB_DELAY} milliseconds each`
    )
  })
  .catch((error) => {
    console.error(`[ERROR] Couldn't connect to Redis, got error: ${error}`)
  })

// Report Queue Event Listeners
queue.on('waiting', (jobID) => {
  console.info(`[ADDED] Job added with job ID ${jobID}`)
})
queue.on('active', (job) => {
  console.info(`[STARTED] Job ID ${job.id} has been started`)
})
queue.on('completed', (job) => {
  console.info(`[COMPLETED] Job ID ${job.id} has been completed`)
})
queue.on('failed', (job) => {
  console.error(`[FAILED] Job ID ${job.id} has been failed`)
})
queue.on('error', (job) => {
  console.error(`[ERROR] An error occurred by the queue, got ${job}`)
})
queue.on('cleaned', function () {
  console.info(`[CLEANED] Report queue has been cleaned`)
})
queue.on('drained', function () {
  console.info(`[WAITING] Waiting for jobs...`)
})

queue.process(async (job) => {
  console.info(`[PROCESS] Job ID ${job.id} is being processed`)
  await new Promise((resolve) => setTimeout(resolve, JOB_DELAY))
  console.info(`[PROCESS] Job ID ${job.id} has been processed`)
})

import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  queue.add({ name: 'John Doe' })

  res.status(200).json({ name: 'John Doe' })
}
