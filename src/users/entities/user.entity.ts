// import { Roles } from "src/utility/common/user-roles.enum";
import { Exclude } from "class-transformer";
import { Roles } from "../../utility/common/user-roles.enum";

import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
// import { Timestamp } from "typeorm/browser";

@Entity('users')
export class UserEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({unique: true})
    email: string

    @Column({select: false})
    @Exclude()
    password: string

    @Column({type: 'enum', enum: Roles, array: true, default:[Roles.USER]})
    roles: Roles[]

    @CreateDateColumn()
    createdAt: Date 

    @UpdateDateColumn()
    updatedAt: Date
}
