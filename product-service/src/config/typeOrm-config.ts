import { Injectable } from "@nestjs/common";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";

@Injectable()
export class TypeormDbConfig implements TypeOrmOptionsFactory{
    createTypeOrmOptions(connectionName?: string): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
      
        return {
            type:'postgres',
            host:process.env.DB_POSTGRESS_HOST,
            port:+process.env.DB_POSTGRESS_PORT,
            password:process.env.DB_POSTGRESS_PASSWORD,
            username:process.env.DB_POSTGRESS_USERNAME,
            database:process.env.DB_POSTGRESS_NAME,
            entities:['dist/modules/**/*.entity.{js,ts}'],
            synchronize:true
        }
    }
}