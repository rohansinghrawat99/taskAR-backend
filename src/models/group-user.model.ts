import {
    AutoIncrement, BelongsTo,
    Column,
    DataType, Default,
    ForeignKey,
    Model,
    PrimaryKey,
    Table,
    Unique
} from "sequelize-typescript";
import { User } from "./user.model";
import { Group } from "./group.model";
import { GroupRole, MemberStatus } from "../util/enum.util";
import { Helpers } from "../util/helpers.util";

@Table({
    timestamps: true,
    paranoid: false,
    tableName: "group_users"
})
export class GroupUser extends Model<GroupUser> {

    @Unique
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id: number;

    @ForeignKey(() => Group)
    @Column(DataType.BIGINT)
    group_id: number;

    @ForeignKey(() => User)
    @Column(DataType.BIGINT)
    member_id: number;

    @Column(DataType.ENUM({values: Helpers.iterateEnum<GroupRole>(GroupRole)}))
    role: GroupRole;

    @Default(MemberStatus.PENDING)
    @Column(DataType.ENUM({values: Helpers.iterateEnum<MemberStatus>(MemberStatus)}))
    status: MemberStatus;

    @BelongsTo(() => User)
    user: User;

    @BelongsTo(() => Group)
    group: Group;
}
