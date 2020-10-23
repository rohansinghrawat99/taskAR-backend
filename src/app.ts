import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import * as _ from "lodash";
import { dbService } from "./services/db.service";
import { ENV_APP_PORT_REST, IS_PRODUCTION } from "./util/secrets.util";
import { userService } from "./services/entities/user.service";
import { UserController } from "./controllers/user.controller";
import { userMiddleware } from "./middlewares/user.middleware";
import { Helpers } from "./util/helpers.util";
import { RouteNotFoundException } from "./exceptions/route-not-found.exception";
import { errorHandler } from "./handlers/error-handler";
import { taskService } from "./services/entities/task.service";
import { groupUserService } from "./services/entities/group-user.service";
import { groupService } from "./services/entities/group.service";
import { TaskController } from "./controllers/task.controller";
import moment from "moment";
import { GroupController } from "./controllers/group.controller";

const compression = require("compression");

const appErrorHandler = require("errorhandler");

export class Application {
    private readonly APP: express.Application;
    private readonly PORT: number;
    private readonly ALLOWED_ORIGINS = [
        "https://ar-taskers-backend.herokuapp.com/",
        "http://localhost:4200",
        "http://localhost:3000",
        "https://dev.surfside.devslane.com",
        "https://stage.surfside.devslane.com",
        "https://dev.surfsidefoods.work",
        "https://staging.surfsidefoods.work"
    ];

    constructor(port: number) {
        this.APP = express();
        this.PORT = port;

        this.setupCORS();
        this.initServices();
        this.initGlobalMiddleware();
        this.initRoutes();
    }

    initRoutes() {
        // Static Public Content
        this.APP.use("/public", express.static("public", {maxAge: 31557600000}));

        this.APP.get("/test", errorHandler((req: express.Request, res: express.Response) => {
            console.log(moment().format());
            return res.json({
                success: true
            });
        }));

        // PUBLIC APIS
        this.APP.post("/login", errorHandler(UserController.login));
        // USER APIS
        this.APP.get("/users", userMiddleware, errorHandler(UserController.index));
        this.APP.get("/users/:id([0-9]+)", userMiddleware, errorHandler(UserController.showById));
        this.APP.put("/users", userMiddleware, errorHandler(UserController.updateUserProfile));

        // TASK APIS
        this.APP.get("/tasks/personal-todo", userMiddleware, errorHandler(TaskController.listPersonalToDo));
        this.APP.get("/tasks/personal-completed", userMiddleware, errorHandler(TaskController.listPersonalCompleted));
        this.APP.get("/tasks/personal-overdue", userMiddleware, errorHandler(TaskController.listPersonalOverDue));
        this.APP.get("/tasks/:id([0-9]+)", userMiddleware, errorHandler(TaskController.showById));
        this.APP.get("/tasks/my-group-todo/:id([0-9]+)", userMiddleware, errorHandler(TaskController.listMyGroupTodo));
        this.APP.get("/tasks/my-group-under-review/:id([0-9]+)", userMiddleware, errorHandler(TaskController.listMyGroupUnderReview));
        this.APP.get("/tasks/my-group-completed/:id([0-9]+)", userMiddleware, errorHandler(TaskController.listMyGroupCompleted));
        this.APP.get("/tasks/my-group-overdue/:id([0-9]+)", userMiddleware, errorHandler(TaskController.listMyGroupOverDue));
        this.APP.post("/tasks", userMiddleware, errorHandler(TaskController.create));
        this.APP.put("/tasks/:id([0-9]+)", userMiddleware, errorHandler(TaskController.updateTaskStatus));

        // GROUP APIS
        this.APP.get("/groups/created", userMiddleware, errorHandler(GroupController.listMyCreatedGroups));
        this.APP.get("/groups/joined", userMiddleware, errorHandler(GroupController.listMyJoinedGroups));
        this.APP.post("/groups", userMiddleware, errorHandler(GroupController.create));
        this.APP.post("/groups/join", userMiddleware, errorHandler(GroupController.join));
        this.APP.get("/groups/:id([0-9]+)/members", userMiddleware, errorHandler(GroupController.showGroupMembers));

        this.APP.all("*", (req: express.Request, res: express.Response) => Helpers.handleError(res, new RouteNotFoundException()));
    }

    start(): void {
        this.APP.listen(process.env.PORT, () => {
            console.log(`App Started on PORT: ${process.env.PORT}`);
        });
    }

    private setupCORS(): void {
        this.APP.use(cors({
            origin: (origin, callback) => {
                if (!origin || _.includes(this.ALLOWED_ORIGINS, origin)) {
                    callback(undefined, true);
                } else {
                    callback(new Error("Not allowed by CORS"));
                }
            },
            methods: [
                "GET",
                "HEAD",
                "PUT",
                "PATCH",
                "POST",
                "DELETE"
            ],
            exposedHeaders: ["Content-Disposition"]
        }));
        this.APP.options("*");
    }

    // Express configuration
    private initGlobalMiddleware(): void {
        this.APP.set("port", process.env.PORT);
        this.APP.use(bodyParser.json());
        this.APP.use(bodyParser.urlencoded({extended: true}));
        this.APP.use(compression({
            level: 3
        }));

        if (IS_PRODUCTION) {
            this.APP.use(appErrorHandler());
        }
    }

    private initServices(): void {
        // Entities
        userService;
        taskService;
        groupService;
        groupUserService;

        // Factories

        // Others
        dbService;
    }
}


