import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException, Logger } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { promises as fs } from 'fs'

const logger = new Logger('UploadController')

@Controller('upload')
export class UploadController {
  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: async (req, file, cb) => {
          const uploadDir = './uploads'
          try {
            await fs.mkdir(uploadDir, { recursive: true })
            logger.log(`上传目录已准备: ${uploadDir}`)
            cb(null, uploadDir)
          } catch (error) {
            logger.error(`创建上传目录失败: ${error}`)
            cb(error, uploadDir)
          }
        },
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('')
          const filename = `${randomName}${extname(file.originalname)}`
          logger.log(`已生成文件名: ${filename}`)
          cb(null, filename)
        },
      }),
      fileFilter: (req, file, cb) => {
        logger.log(`上传文件: ${file.originalname}, mimetype: ${file.mimetype}`)
        const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true)
        } else {
          logger.warn(`文件类型不支持: ${file.mimetype}`)
          cb(new BadRequestException('只支持上传图片文件'), false)
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    })
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    logger.log(`uploadImage 方法被调用`)
    logger.log(`接收到的文件:`, file ? { filename: file.filename, size: file.size, mimetype: file.mimetype } : 'undefined')
    
    if (!file) {
      logger.error('文件为空')
      throw new BadRequestException('请上传图片文件')
    }
    
    const response = {
      url: `/uploads/${file.filename}`,
      filename: file.filename,
    }
    logger.log(`上传成功，返回响应:`, response)
    return response
  }
}
