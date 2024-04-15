import { Request, Response } from 'express';
import { AppResponse } from '../libs/response.lib';
import MessageQueueService from '../libs/message-queue.lib';
import { SegmentService } from '../services/segment.service';
const msgQueue = new MessageQueueService();

(async () => {
  await msgQueue.connect();
})();
export class SegmentController {
  static async createSegment(req: Request, res: Response) {
    const newSegment = await SegmentService.createSegment(req.body);

    // Add segment to MessageQueue
    // const msgQueue = new MessageQueueService();
    // await msgQueue.connect();
    // // Consider not waiting
    await msgQueue.produceMessage(JSON.stringify(newSegment));
    // - Update redis
    // - Index in search
    // - Notify users about new category

    return AppResponse.created({
      res,
      message: 'New segment craeted',
      data: newSegment,
    });
  }
  static async listSegments(req: Request, res: Response) {
    const filter: { segmentName?: string } = {
      segmentName: req.query.name as string,
    };
    const segmentList = await SegmentService.listSegments(filter);

    return AppResponse.ok({
      res,
      message: 'segment lists',
      data: segmentList,
    });
  }
}
