import { Column } from "typeorm";
import { BaseEntity } from "./baseEntity";

export abstract class BaseFileEntity extends BaseEntity {
        //columns
        @Column({ nullable: false, type: String })
        filename: string
    
        @Column({ nullable: false, type: String })
        path: string
    
        @Column({ nullable: false, type: Number })
        size: number
    
        @Column({ nullable: false, type: String })
        originalname: string
    
        @Column({ nullable: false, type: String })
        mimetype: string
    
        @Column({ nullable: false, type: String })
        encoding: string
}