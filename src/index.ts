import { resolve } from "dns";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function showMenu(): void {
  console.log("\n=== Task Manager CLI ===");
  console.log("1. Add task");
  console.log("2. List tasks");
  console.log("3. Complete task");
  console.log("4. Delete task");
  console.log("5. Exit");
}

function ask(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

function printTasks(tasks: Task[]): void {
  console.log("\n--- Tasks ---");

  tasks.forEach((task) => {
    const statusIcon = task.status === TaskStatus.Completed ? "✔" : "○";

    console.log(`${task.id} | ${statusIcon} ${task.title}`);
  });
}

function parseId(input: string): number | null {
  const id = Number(input);
  return Number.isNaN(id) ? null : id;
}

function exitApp(): void {
  console.log("Goodbye!");
  rl.close();
}

enum TaskStatus {
  Pending = "PENDING",
  Completed = "COMPLETED",
}

interface Task {
  id: number;
  title: string;
  status: TaskStatus;
}

let tasks: Task[] = [];

// tasks.push({
//   id: 1,
//   title: "Learn TypeScript basics",
//   status: TaskStatus.Pending,
// });

// console.log(tasks);

function addTask(title: string): Task | null {
  if (!title.trim()) return null;

  const newTask: Task = {
    id: Date.now(),
    title,
    status: TaskStatus.Pending,
  };

  tasks.push(newTask);
  return newTask;
}

function listTasks(): Task[] {
  return tasks;
}

function completeTask(taskId: number): boolean {
  const task = tasks.find((t) => t.id === taskId);

  if (!task) return false;

  task.status = TaskStatus.Completed;
  return true;
}

function deleteTask(taskId: number): boolean {
  const initialLength = tasks.length;
  tasks = tasks.filter((t) => t.id !== taskId);
  return tasks.length < initialLength;
}

/*
const task1 = addTask("Learn TypeScript");
const task2 = addTask("Build CLI app");

console.log(listTasks());

completeTask(task1.id);
deleteTask(task2.id);

console.log(listTasks());
*/

async function main(): Promise<void> {
  let running = true;

  while (running) {
    showMenu();
    const choice = await ask("Choose an option: ");

    switch (choice) {
      case "1": {
        const title = await ask("Task title: ");
        const task = addTask(title);
        console.log(task ? "Task added." : "Invalid title.");
        break;
      }
      case "2": {
        const allTasks = listTasks();
        if (allTasks.length === 0) {
          console.log("No tasks available.");
        } else {
          printTasks(allTasks);
        }
        break;
      }
      case "3": {
        const id = parseId(await ask("Task ID to complete: "));
        const success = completeTask(id!);
        console.log(success ? "Task completed." : "Task not found.");
        break;
      }
      case "4": {
        const id = parseId(await ask("Task ID to delete: "));
        const success = deleteTask(id!);
        console.log(success ? "Task deleted." : "Task not found.");
        break;
      }
      case "5": {
        running = false;
        exitApp();
        break;
      }
      default:
        console.log("Invalid option.");
    }
  }

  rl.close();
}

main();
