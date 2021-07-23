import { Request, Response } from 'express';

import { createResponse } from '../utility';

/*
 *   GET /parse
 *   Parses something??
 *
 *   REQ: {
 *      courseCode: <string>,
 *   }
 *
 *   RES: {
 *      code: number,
 *      message: string,
 *      data: Course,
 *      error: boolean
 *   }
 */
export async function parse(req: Request, res: Response): Promise<Response> {
  try {
    const { courseCode } = req.body;
    if (!courseCode) {
      return res.status(400).json(createResponse(400, 'Missing course code', null, true));
    }

    // do some logic

    return res.status(200).json(
      createResponse(
        200,
        'Successfully parsed course',
        {
          courseCode: 'CIS*4250',
          openSpots: 10,
          capacity: 100,
          // ......
        },
        false,
      ),
    );
  } catch (error) {
    return res.status(400).json(createResponse(400, error.message, null, true));
  }
}
