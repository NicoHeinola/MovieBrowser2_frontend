export const userShowStatuses = [
  { value: "watching", text: "Watching", icon: "mdi-eye" },
  { value: "planned", text: "Planned", icon: "mdi-calendar-plus" },
  { value: "dropped", text: "Dropped", icon: "mdi-close" },
  { value: "on_hold", text: "On Hold", icon: "mdi-pause" },
  { value: "completed", text: "Completed", icon: "mdi-check" },
  { value: null, text: "Unknown", icon: "mdi-help-circle" },
];

export default interface UserShowStatus {
  id?: number;
  show_id?: number;
  user_id?: number;
  status?: string;
}
