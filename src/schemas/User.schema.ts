import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class User{

    @Prop({unique: true, required: true})
    username : String

    @Prop()
    displayname? : String

    @Prop()
    avatarUrl? : String
}

export const UserSchema =  SchemaFactory.createForClass(User)