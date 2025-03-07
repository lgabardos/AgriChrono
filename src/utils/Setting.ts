import type Assignment from './Assignment'
import type Driver from './Driver'
import type Farm from './Farm'
import type Plot from './Plot'
import type Task from './Task'

export default class Setting {
  constructor(
    public drivers: Driver[],
    public farms: Farm[],
    public plots: Plot[],
    public tasks: Task[],
    public assignments?: Assignment[],
  ) {}
}
