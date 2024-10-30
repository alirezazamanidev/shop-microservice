import { AdminEntity } from "src/modules/admin/entities/admin.entity"
import { UserEntity } from "src/modules/user/entities"


declare global {
    namespace Express {
        interface Request {
            user?:{
                id:number
            }
        }
    }
}
