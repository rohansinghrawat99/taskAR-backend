import { User } from "../models/user.model";
import { Dictionary } from "async";
import { TransformerAbstract } from "./base/transformer.abstract";

export class UserTransformer extends TransformerAbstract<User> {

    protected _map(user: User): Dictionary<any> {
        return {
            id: user.id,
            google_id: user.google_id,
            name: user.name,
            email: user.email,
            profile_pic_url: user.profile_pic_url,
            created_at: user.createdAt,
            updated_at: user.updatedAt,
        };
    }
}