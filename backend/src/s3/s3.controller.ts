import {
    Controller,
    Post,
    Get,
    Delete,
    Param,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from './s3.service';

@Controller('api')
export class S3Controller {
    constructor(private readonly s3Service: S3Service) { }

    @Post('files')
    @UseInterceptors(FileInterceptor('file'))
    upload(@UploadedFile() file: Express.Multer.File) {
        return this.s3Service.upload(file);
    }

    @Get('files')
    list() {
        return this.s3Service.listFiles();
    }

    @Delete('files/:key')
    remove(@Param('key') key: string) {
        return this.s3Service.deleteFile(key);
    }
}
