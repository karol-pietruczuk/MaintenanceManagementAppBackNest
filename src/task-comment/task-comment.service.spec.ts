import { Test, TestingModule } from "@nestjs/testing";
import { TaskCommentService } from "./task-comment.service";

describe("TaskCommentService", () => {
  let service: TaskCommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskCommentService]
    }).compile();

    service = module.get<TaskCommentService>(TaskCommentService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
