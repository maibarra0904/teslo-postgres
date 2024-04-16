import { Controller, Post, Param, UseInterceptors, UploadedFile, Get, Res } from '@nestjs/common';
import { ImagesService } from './images.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { multerOptions } from './helpers/multer.helper';
import { ProductsService } from 'src/products/products.service';
import { join } from 'path';
import { GetUser2 } from '../auth/decorators/get-user.decorator';
import { User } from '../auth/entities/user.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Images')
@Controller('images')
export class ImagesController {
  constructor(
    private readonly imagesService: ImagesService,

    private readonly productsService: ProductsService
  ) {}

  @Post(':id')
  @UseInterceptors(FileInterceptor('imagen', multerOptions))
  uploadFile(
    @GetUser2() user: User,
    @UploadedFile() file: Express.Multer.File, 
    @Param('id') id: string,
    
  ) {

    return this.imagesService.uploadFile(id , file, user);
  }

  @Get(':imgpath')
  seeUploadedFile(@Param('imgpath') image, @Res() res: Response) {
    return res.sendFile(join(process.cwd(), 'uploads', image));
  }

}
