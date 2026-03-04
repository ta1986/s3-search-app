import {
    Injectable,
    Logger,
    BadRequestException,
    InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
    ListObjectsV2Command,
} from '@aws-sdk/client-s3';

export interface S3File {
    key: string;
    size: number;
    lastModified: Date;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024;

@Injectable()
export class S3Service {
    private readonly s3: S3Client;
    private readonly bucket: string;
    private readonly prefix: string;
    private readonly logger = new Logger(S3Service.name);

    constructor(private config: ConfigService) {
        this.bucket = this.config.get<string>('S3_BUCKET_NAME', 'my-bucket');
        this.prefix = this.config.get<string>('S3_PREFIX', '');

        this.s3 = new S3Client({
            region: this.config.get<string>('AWS_REGION', 'us-east-1'),
        });
    }

    async upload(file: Express.Multer.File): Promise<S3File> {
        if (!file) {
            throw new BadRequestException('No file provided');
        }
        if (file.size > MAX_FILE_SIZE) {
            throw new BadRequestException(
                `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max is 50 MB.`,
            );
        }

        const key = `${this.prefix}${Date.now()}-${file.originalname}`;
        this.logger.log(`Uploading ${key} (${file.size} bytes)`);

        try {
            await this.s3.send(
                new PutObjectCommand({
                    Bucket: this.bucket,
                    Key: key,
                    Body: file.buffer,
                    ContentType: file.mimetype,
                }),
            );
        } catch (err) {
            this.logger.error(`Upload failed for ${key}`, (err as Error).stack);
            throw new InternalServerErrorException('Upload to S3 failed');
        }

        return { key, size: file.size, lastModified: new Date() };
    }

    async listFiles(): Promise<S3File[]> {
        const files: S3File[] = [];
        let continuationToken: string | undefined;

        try {
            do {
                const result = await this.s3.send(
                    new ListObjectsV2Command({
                        Bucket: this.bucket,
                        Prefix: this.prefix || undefined,
                        ContinuationToken: continuationToken,
                    }),
                );

                for (const obj of result.Contents ?? []) {
                    files.push({
                        key: obj.Key!,
                        size: obj.Size ?? 0,
                        lastModified: obj.LastModified ?? new Date(),
                    });
                }

                continuationToken = result.IsTruncated
                    ? result.NextContinuationToken
                    : undefined;
            } while (continuationToken);
        } catch (err) {
            this.logger.error('Failed to list files', (err as Error).stack);
            throw new InternalServerErrorException('Failed to list S3 objects');
        }

        return files;
    }

    async deleteFile(key: string): Promise<{ deleted: true }> {
        this.logger.log(`Deleting ${key}`);
        try {
            await this.s3.send(
                new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
            );
        } catch (err) {
            this.logger.error(`Delete failed for ${key}`, (err as Error).stack);
            throw new InternalServerErrorException('Delete from S3 failed');
        }
        return { deleted: true };
    }
}
