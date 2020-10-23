import {
    AllowNull,
    AutoIncrement,
    BelongsToMany,
    Column,
    DataType, HasMany,
    Model,
    PrimaryKey,
    Table,
    Unique
} from "sequelize-typescript";
import { Group } from "./group.model";
import { GroupUser } from "./group-user.model";
import { Task } from "./task.model";

@Table({
    timestamps: true,
    paranoid: false,
    tableName: "users"
})
export class User extends Model<User> {

    @Unique
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id: number;

    @Column(DataType.STRING)
    google_id: string;

    @Column(DataType.STRING)
    name: string;

    @Column(DataType.STRING)
    email: string;

    @AllowNull(true)
    @Column(DataType.STRING)
    profile_pic_url: string;

    @BelongsToMany(() => Group, () => GroupUser)
    groups: Group[];

    @HasMany(() => Task, "assigned_to_id")
    tasksAssigned: Task[];

    @HasMany(() => Task, "creator_id")
    tasksCreated: Task[];
}
