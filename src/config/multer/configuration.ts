import { existsSync } from 'fs';
import { extname } from 'path';

import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { Request } from 'express';
import { diskStorage } from 'multer';
import * as mkdirp from 'mkdirp';
import { v4 as uuid } from 'uuid';
import * as moment from 'moment-timezone';

import { ApiException } from '@src/filter/api-exception.filter';
import { ApiErrorCode } from '@src/common/enum/api-error-code.enum';

type multerOptionsCallBack = (error: Error | null, acceptFile: boolean) => void;

type multerDiskStorageDestinationCallBack = (
  error: Error | null,
  destination: string,
) => void;

type multerDiskStorageFilenameCallBack = (
  error: Error | null,
  filename: string,
) => void;

export const multerConfig = {
  avatar: {
    root: './media/avatar',
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },

  pipeline: {
    root: './media/pipeline',
    fileSize: 10 * 1024 * 1024,
    files: 1,
  },

  public: {
    root: './media/public',
    fileSize: 20 * 1024 * 1024,
    files: 5,
  }
}


/**
 * getAvatarMulterOptions, getPipelineMulterOptions, getPublicMulterOptions
 * 可以更优雅的封装为一个 Class, 但是! 此处需要返回一个 MulterOptions, 并且! 需要在装饰器中注入，例如：
 * @UseInterceptors(
 *  FileInterceptor('file', getAvatarMulterOptions()),
 * )
 * public async upload() {...}
 * 
 * #TODO 单独扩展 FileInterceptor, 将下下方函数封装为类，集成至拦截器中
 */

// 用户头像上传
export const getAvatarMulterOptions = (): MulterOptions =>  {
  return {
    /**
     * 文件大小、数量限制
     */
    limits: {
      fileSize: multerConfig.avatar.fileSize,
      files: multerConfig.avatar.files,
    },
    /**
     * 文件格式校验
     */
    fileFilter: (
      req: Request,
      file: Express.Multer.File,
      cb: multerOptionsCallBack,
    ): void => {
      if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        cb(null, true);
      } else {
        cb(
          new ApiException(
            '只能上传 jpg|jpeg|png|gif 类型的图片',
            ApiErrorCode.FILE_MIMETYPE_INVALID,
          ),
          false,
        );
      }
    },
    /**
     * 文件存储方式
     */
    storage: diskStorage({
      /**
       * 存储目录: `${root}/${year}/${month}/${date}`
       * 例如：./media/2020/09/13
       */
      destination: async (
        req: Request,
        file: Express.Multer.File,
        cb: multerDiskStorageDestinationCallBack,
      ): Promise<void> => {
        const root = multerConfig.avatar.root;

        const year = moment().get('y');

        const m = moment().get('M') + 1;
        const month = m > 10 ? m : `0${m}`;
        
        const date = moment().get('D');

        const fullPath = `${root}/${year}/${month}/${date}`;

        // 如果目录不存在，则创建目录
        if (!existsSync(fullPath)) {
          await mkdirp(fullPath);
        }

        cb(null, fullPath);
      },
      filename: (
        req: Request,
        file: Express.Multer.File,
        cb: multerDiskStorageFilenameCallBack,
      ) => {
        cb(null, `${uuid()}${extname(file.originalname)}`);
      },
    }),
  };
}

// 流水线压缩包上传
export const getPipelineMulterOptions = (): MulterOptions =>  {
  return {
    /**
     * 文件大小、数量限制
     */
    limits: {
      fileSize: multerConfig.pipeline.fileSize,
      files: multerConfig.pipeline.files,
    },
    /**
     * 文件格式校验
     */
    fileFilter: (
      req: Request,
      file: Express.Multer.File,
      cb: multerOptionsCallBack,
    ): void => {
      if (file.mimetype.match(/\/(zip))$/)) {
        cb(null, true);
      } else {
        cb(
          new ApiException(
            '只能上传 zip 类型的文件',
            ApiErrorCode.FILE_MIMETYPE_INVALID,
          ),
          false,
        );
      }
    },
    /**
     * 文件存储方式
     */
    storage: diskStorage({
      /**
       * 存储目录: `${root}/${year}/${month}/${date}`
       * 例如：./media/2020/09/13
       */
      destination: async (
        req: Request,
        file: Express.Multer.File,
        cb: multerDiskStorageDestinationCallBack,
      ): Promise<void> => {
        const root = multerConfig.pipeline.root;

        const year = moment().get('y');

        const m = moment().get('M') + 1;
        const month = m > 10 ? m : `0${m}`;
        
        const date = moment().get('D');

        const fullPath = `${root}/${year}/${month}/${date}`;

        // 如果目录不存在，则创建目录
        if (!existsSync(fullPath)) {
          await mkdirp(fullPath);
        }

        cb(null, fullPath);
      },
      filename: (
        req: Request,
        file: Express.Multer.File,
        cb: multerDiskStorageFilenameCallBack,
      ) => {
        cb(null, `${uuid()}${extname(file.originalname)}`);
      },
    }),
  };
}

// 公共资源上传，如：富文本图片、分类图片等等
export const getPublicMulterOptions = (): MulterOptions =>  {
  return {
    /**
     * 文件大小、数量限制
     */
    limits: {
      fileSize: multerConfig.public.fileSize,
      files: multerConfig.public.files,
    },
    /**
     * 文件格式校验
     */
    fileFilter: (
      req: Request,
      file: Express.Multer.File,
      cb: multerOptionsCallBack,
    ): void => {
      if (file.mimetype.match(/\/(jpg|jpeg|png|gif|mp4|zip))$/)) {
        cb(null, true);
      } else {
        cb(
          new ApiException(
            '只能上传 jpg|jpeg|png|gif|mp4|zip 类型的文件',
            ApiErrorCode.FILE_MIMETYPE_INVALID,
          ),
          false,
        );
      }
    },
    /**
     * 文件存储方式
     */
    storage: diskStorage({
      /**
       * 存储目录: `${root}/${year}/${month}/${date}`
       * 例如：./media/2020/09/13
       */
      destination: async (
        req: Request,
        file: Express.Multer.File,
        cb: multerDiskStorageDestinationCallBack,
      ): Promise<void> => {
        const root = multerConfig.pipeline.root;

        const year = moment().get('y');

        const m = moment().get('M') + 1;
        const month = m > 10 ? m : `0${m}`;
        
        const date = moment().get('D');

        const fullPath = `${root}/${year}/${month}/${date}`;

        // 如果目录不存在，则创建目录
        if (!existsSync(fullPath)) {
          await mkdirp(fullPath);
        }

        cb(null, fullPath);
      },
      filename: (
        req: Request,
        file: Express.Multer.File,
        cb: multerDiskStorageFilenameCallBack,
      ) => {
        cb(null, `${uuid()}${extname(file.originalname)}`);
      },
    }),
  };
}