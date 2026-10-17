import type { components } from './schema'

type Schemas = components['schemas']

export type User = Schemas['UserOut']
export type Today = Schemas['TodayOut']
export type TodayRoutine = Schemas['TodayRoutineOut']
export type TodayItem = Schemas['TodayItemOut']
export type TodayState = Schemas['TodayState']
export type CheckStatus = Schemas['CheckStatus']
export type Routine = Schemas['RoutineOut']
export type Schedule = Schemas['ScheduleOut']
export type Habit = Schemas['HabitOut']
export type HabitStats = Schemas['HabitStatsOut']
export type Milestone = Schemas['MilestoneOut']
export type HabitHistory = Schemas['HabitHistoryOut']
export type DayOutcome = Schemas['DayOutcome']
