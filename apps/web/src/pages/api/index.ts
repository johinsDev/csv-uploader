import env from '@/env'
import { Queue, Worker } from 'bullmq'
import { NextApiRequest, NextApiResponse } from 'next'

const connection = {
  host: env.REDIS_URL?.split(':')[0] || 'localhost',
  port: parseInt(env.REDIS_URL?.split(':')[1] || '6379'),
}

const queue = new Queue('test', {
  connection,
})

const JOB_DELAY = 1000

// Report Queue Event Listeners
// queue.on('waiting', (jobID) => {
//   console.info(`[ADDED] Job added with job ID ${jobID}`)
// })
// queue.on('active', (job) => {
//   console.info(`[STARTED] Job ID ${job.id} has been started`)
// })
// queue.on('completed', (job) => {
//   console.info(`[COMPLETED] Job ID ${job.id} has been completed`)
// })
// queue.on('failed', (job) => {
//   console.error(`[FAILED] Job ID ${job.id} has been failed`)
// })
// queue.on('error', (job) => {
//   console.error(`[ERROR] An error occurred by the queue, got ${job}`)
// })
// queue.on('cleaned', function () {
//   console.info(`[CLEANED] Report queue has been cleaned`)
// })
// queue.on('drained', function () {
//   console.info(`[WAITING] Waiting for jobs...`)
// })

const worker = new Worker(
  'test',
  async (job) => {
    console.info(
      `[PROCESS] Job ID ${job.id} is being processed`,
      JSON.stringify(job)
    )

    await new Promise((resolve) => setTimeout(resolve, JOB_DELAY * 10))

    console.info(`[PROCESS] Job ID ${job.id} has been processed`)
  },
  {
    connection,
    concurrency: 13,
  }
)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const name = 'John Doe'
  queue.add(
    'test',
    { name },
    {
      parent: {
        id: '123',
        queue: 'test',
      },
    }
  )

  res.status(200).json({ name: 'John Doe' })
}
