import {
    AllowNull,
    AutoIncrement, BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    PrimaryKey,
    Table,
    Unique
} from "sequelize-typescript";
import { User } from "./user.model";
import { Group } from "./group.model";
import { Helpers } from "../util/helpers.util";
import { TaskStatus } from "../util/enum.util";

@Table({
    timestamps: true,
    paranoid: false,
    tableName: "tasks"
})
export class Task extends Model<Task> {

    @Unique
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id: number;

    @Column(DataType.STRING)
    title: string;

    @Column(DataType.STRING)
    description: string;

    @AllowNull(true)
    @ForeignKey(() => Group)
    @Column(DataType.BIGINT)
    group_id: number;

    @ForeignKey(() => User)
    @Column(DataType.BIGINT)
    assigned_to_id: number;

    @Column(DataType.DATE)
    due_time: string;

    @Column(DataType.ENUM({values: Helpers.iterateEnum<TaskStatus>(TaskStatus)}))
    status: TaskStatus;

    @ForeignKey(() => User)
    @Column(DataType.BIGINT)
    creator_id: number;

    @BelongsTo(() => User, "assigned_to_id")
    assignedTo: User;

    @BelongsTo(() => User, "creator_id")
    creatorUser: User;

    @BelongsTo(() => Group)
    group: Group;
}
