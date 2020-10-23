import {
    AllowNull,
    AutoIncrement, BelongsTo, BelongsToMany,
    Column,
    DataType,
    ForeignKey, HasMany,
    Model,
    PrimaryKey,
    Table,
    Unique
} from "sequelize-typescript";
import { User } from "./user.model";
import { GroupUser } from "./group-user.model";

@Table({
    timestamps: true,
    paranoid: false,
    tableName: "groups"
})
export class Group extends Model<Group> {

    @Unique
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id: number;

    @Column(DataType.STRING)
    name: string;

    @ForeignKey(() => User)
    @Column(DataType.BIGINT)
    admin_id: number;

    @Column(DataType.STRING)
    code: string;

    @BelongsTo(() => User)
    admin: User;

    @BelongsToMany(() => User, () => GroupUser)
    members: User[];
}
