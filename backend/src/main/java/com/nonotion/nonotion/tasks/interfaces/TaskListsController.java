package com.nonotion.nonotion.tasks.interfaces;

import com.nonotion.nonotion.tasks.application.dto.CreateTaskListsRequest;
import com.nonotion.nonotion.tasks.application.dto.RenameTaskListsRequest;
import com.nonotion.nonotion.tasks.application.dto.TaskListsResponse;
import com.nonotion.nonotion.tasks.application.port.in.TaskListsUseCase;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/task-lists")
public class TaskListsController {

    private final TaskListsUseCase taskListsUseCase;

    public TaskListsController(TaskListsUseCase taskListsUseCase) {
        this.taskListsUseCase = taskListsUseCase;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TaskListsResponse createTaskList(@Valid @RequestBody CreateTaskListsRequest request) {
        return taskListsUseCase.createTaskList(request);
    }

    @GetMapping
    public List<TaskListsResponse> getAllTaskLists() {
        return taskListsUseCase.findAllForCurrentUser();
    }

    @GetMapping("/{id}")
    public TaskListsResponse getTaskList(@PathVariable Long id) {
        return taskListsUseCase.findAllForCurrentUser().stream()
                .filter(tl -> tl.id().equals(id))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Lista no encontrada"));
    }

    @PutMapping("/{id}")
    public TaskListsResponse renameTaskList(@PathVariable Long id, @Valid @RequestBody RenameTaskListsRequest request) {
        return taskListsUseCase.renameTaskList(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTaskList(@PathVariable Long id) {
        taskListsUseCase.delete(id);
    }
}
