import { Controller, Get, Post, UseGuards, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DatabaseService } from './database.service';

@Controller('api/database')
@UseGuards(JwtAuthGuard)
export class DatabaseController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get('export')
  async exportDatabase(@Res() res: Response) {
    try {
      const data = await this.databaseService.exportAllData();
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `g8_community_backup_${timestamp}.json`;
      
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(JSON.stringify(data, null, 2));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importDatabase(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file) {
        return { success: false, message: '请上传备份文件' };
      }

      const content = file.buffer.toString('utf-8');
      const data = JSON.parse(content);
      
      const result = await this.databaseService.importData(data);
      return { success: true, message: '数据导入成功', result };
    } catch (error) {
      return { success: false, message: `导入失败: ${error.message}` };
    }
  }
}
