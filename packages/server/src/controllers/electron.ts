import { Request, Response } from 'express';
import path from 'path';

import { createResponse } from '../utility';

export async function downloadElectronApp(req: Request, res: Response): Promise<Response | void> {
  try {
    const os = req.query.os;
    return res.download(path.join(__dirname, `../assets/ElectronBuilds/course_parser_${os}.zip`));
    // return res.status(200).json(createResponse(200, 'Electron App downloaded', null, false));
  } catch (error) {
    return res.status(400).json(createResponse(400, error.message, null, true));
  }
}
