import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';

export default function SwaggerConfig(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('****** App Shop Application ******')
    .addSecurity('authorization', {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'authorization',
      in: 'header',
    })
    .setContact('alireza', null, 'alirezazamanidev80@gmail.com')
    .setDescription('The Navad Rouz Application api document!')
    .setVersion('1.0')
    
    .build();
  const theme = new SwaggerTheme();
  const options = {
    explorer: true,
    customCss: theme.getBuffer(SwaggerThemeNameEnum.DARK),
  };
  const document = SwaggerModule.createDocument(app, config, {});
  SwaggerModule.setup('swagger', app, document, options);
}