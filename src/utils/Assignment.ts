import { useSettings } from '@/store/settings'
import type Driver from './Driver'
import type Plot from './Plot'
import type Task from './Task'

export default class Assignment {
  constructor(
    public id: number,
    public worker: Driver,
    public date: Date,
    public type: AssignmentType,
    public time: number,
    public plot?: Plot,
    public task?: Task,
    public value?: number,
  ) {}

  static from(json: Assignment): Assignment {
    return new Assignment(
      json.id,
      json.worker,
      new Date(json.date),
      json.type,
      json.time,
      json.plot,
      json.task,
      json.value,
    )
  }

  static buildDrivers(assignments: Assignment[]) {
    const farms = useSettings().farms.value

    const byType = (type: AssignmentType) => {
      const filtered = assignments.filter((a) => a.type === type)
      const drivers = [...new Set(filtered.map((a) => a.worker.id))]
      const result: { [index: string]: DriverAssignments[] } = {}

      drivers.map((idDriver) => {
        const driverAssignments = filtered.filter((a) => a.worker.id === idDriver)
        result[idDriver] = []

        driverAssignments.forEach((da) => {
          let name = type.toString()
          if (type === AssignmentType.CULTURE || type === AssignmentType.SLURRY) {
            const farm = farms.find((f) => f.id === da.plot?.idFarm)
            name = farm?.name + ' / ' + da.plot?.name
          }
          const time = da.time //(da.task?.speed ?? 0) * (da.plot?.area ?? 0)
          const value = da.value

          const existing = result[idDriver].find((da) => da.name === name)
          if (existing) {
            existing.time += time
            if (existing.value && value) existing.value += value
          } else {
            result[idDriver].push(
              new DriverAssignments(name, time, type === AssignmentType.SLURRY ? value : undefined),
            )
          }
        })
      })
      return result
    }

    return {
      culture: byType(AssignmentType.CULTURE),
      slurry: byType(AssignmentType.SLURRY),
      metha: byType(AssignmentType.METHA),
      other: byType(AssignmentType.OTHER),
    }
  }

  static buildPlots(assignments: Assignment[]) {
    const farms = useSettings().farms.value

    const byType = (type: AssignmentType.CULTURE | AssignmentType.SLURRY) => {
      const assignmentsByType = assignments.filter((a) => a.type === type)
      const plots = [
        ...new Set(
          assignmentsByType.map(
            (a) => (farms.find((f) => f.id === a.plot?.idFarm)?.name ?? '-') + ' / ' + a.plot?.name,
          ),
        ),
      ]
      const resultDrivers: { [index: string]: PlotAssignments[] } = {}
      const resultTasks: { [index: string]: PlotAssignments[] } = {}

      plots.map((plot) => {
        const plotAssignments = assignmentsByType.filter(
          (a) =>
            (farms.find((f) => f.id === a.plot?.idFarm)?.name ?? '-') + ' / ' + a.plot?.name ===
            plot,
        )
        resultDrivers[plot] = []
        resultTasks[plot] = []
        plotAssignments.forEach((pa) => {
          const driver = pa.worker
          const time = pa.time
          const value = pa.value
          const existingDriver = resultDrivers[plot].find((pa) => pa.name === driver.name)
          if (existingDriver) {
            existingDriver.time += time
            if (existingDriver.value && value) existingDriver.value += value
          } else {
            resultDrivers[plot].push(
              new PlotAssignments(
                driver.name,
                time,
                type === AssignmentType.SLURRY ? value : undefined,
              ),
            )
          }
          if (type === AssignmentType.CULTURE) {
            const existingTask = resultTasks[plot].find((p) => p.name === pa.task?.name)
            if (existingTask) {
              existingTask.time += time
            } else {
              resultTasks[plot].push(new PlotAssignments(pa.task?.name ?? '', time))
            }
          }
        })
      })
      return {
        plotsAssignmentsDrivers: resultDrivers,
        plotsAssignmentsTasks: type === AssignmentType.CULTURE ? resultTasks : undefined,
      }
    }
    return {
      culture: byType(AssignmentType.CULTURE),
      slurry: byType(AssignmentType.SLURRY),
    }
  }
}

export class DriverAssignments {
  constructor(
    public name: string,
    public time: number,
    public value?: number,
  ) {}
}
export class PlotAssignments {
  constructor(
    public name: string,
    public time: number,
    public value?: number,
  ) {}
}

export enum AssignmentType {
  CULTURE = 'CULTURE',
  METHA = 'METHA',
  OTHER = 'OTHER',
  SLURRY = 'SLURRY',
}
