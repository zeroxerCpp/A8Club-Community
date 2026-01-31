import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { promises as fs } from 'fs'

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
            cb(null, uploadDir)
          } catch (error) {
            cb(error, uploadDir)
          }
        },
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('')
          cb(null, `${randomName}${extname(file.originalname)}`)
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true)
        } else {
          cb(new BadRequestException('只支持上传图片文件'), false)
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    })
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('请上传图片文件')
    }
    return {
      url: `/uploads/${file.filename}`,
      filename: file.filename,
    }
  }
}
