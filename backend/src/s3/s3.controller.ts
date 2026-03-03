import {
    Controller,
    Post,
    Get,
    Delete,
    Query,
    Param,
    Res,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { S3Service } from './s3.service';

@Controller('api')
export class S3Controller {
    constructor(private readonly s3Service: S3Service) { }

    /** Upload a file */
    @Post('files')
    @UseInterceptors(FileInterceptor('file'))
    upload(@UploadedFile() file: Express.Multer.File) {
        return this.s3Service.upload(file);
    }

    /** List all files */
    @Get('files')
    list() {
        return this.s3Service.listFiles();
    }

    /** Search files by name */
    @Get('search')
    search(@Query('q') query: string) {
        return this.s3Service.search(query ?? '');
    }

    /** Download a file */
    @Get('files/download/:key')
    async download(@Param('key') key: string, @Res() res: Response) {
        const { stream, contentType } = await this.s3Service.download(key);
        res.set({ 'Content-Type': contentType });
        stream.pipe(res);
    }

    /** Delete a file */
    @Delete('files/:key')
    remove(@Param('key') key: string) {
        return this.s3Service.deleteFile(key);
    }
}
