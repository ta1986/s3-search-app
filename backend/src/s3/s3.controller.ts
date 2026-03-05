import {
    Controller,
    Post,
    Get,
    Delete,
    Query,
    Body,
    BadRequestException,
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

    @Delete('files')
    removeByQueryOrBody(
        @Query('key') keyFromQuery?: string,
        @Body('key') keyFromBody?: string,
    ) {
        const key = keyFromQuery ?? keyFromBody;
        if (!key) {
            throw new BadRequestException('Missing required "key" value');
        }
        return this.s3Service.deleteFile(key);
    }
}
