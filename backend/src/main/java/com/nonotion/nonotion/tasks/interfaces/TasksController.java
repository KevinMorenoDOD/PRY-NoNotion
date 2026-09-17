package com.nonotion.nonotion.tasks.interfaces;

import com.nonotion.nonotion.tasks.application.dto.CreateTaskRequest;
import com.nonotion.nonotion.tasks.application.dto.DeleteTaskRequest;
import com.nonotion.nonotion.tasks.application.dto.EditTaskRequest;
import com.nonotion.nonotion.tasks.application.dto.TaskResponse;
import com.nonotion.nonotion.tasks.application.port.in.TasksUseCase;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TasksController {

    private final TasksUseCase tasksUseCase;

    public TasksController(TasksUseCase tasksUseCase) {
        this.tasksUseCase = tasksUseCase;
    }

    @PostMapping
    public TaskResponse createTask(@Valid @RequestBody CreateTaskRequest request) {
        return tasksUseCase.createTask(request);
    }

    @GetMapping("/{id}")
    public TaskResponse getTask(@PathVariable Long id) {
        return tasksUseCase.getTask(id);
    }

    @GetMapping
    public List<TaskResponse> getTasks() {
        return tasksUseCase.getTasks();
    }

    @PutMapping("/{id}")
    public TaskResponse editTask(@PathVariable Long id, @Valid @RequestBody EditTaskRequest request) {
        EditTaskRequest updated = new EditTaskRequest(
                id,
                request.title(),
                request.description(),
                request.priority(),
                request.dueDate(),
                request.taskStatus()
        );
        return tasksUseCase.editTask(updated);
    }

    @DeleteMapping("/{id}")
    public TaskResponse deleteTask(@PathVariable Long id) { 
        return tasksUseCase.deleteTask(id);
    }
}
