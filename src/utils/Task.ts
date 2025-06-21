export default class Task {
  created_at: Date = new Date()
  constructor(
    public id: number,
    public name: string,
    public speed: number,
  ) {}

  static from(task: Task) {
    return new Task(task.id, task.name, task.speed)
  }
}
