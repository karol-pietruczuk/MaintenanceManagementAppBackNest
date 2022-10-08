import { Test, TestingModule } from "@nestjs/testing";
import { TaskCommentController } from "./task-comment.controller";
import { TaskCommentService } from "./task-comment.service";

describe("TaskCommentController", () => {
  let controller: TaskCommentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskCommentController],
      providers: [TaskCommentService]
    }).compile();

    controller = module.get<TaskCommentController>(TaskCommentController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
