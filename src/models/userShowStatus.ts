export const userShowStatuses = [
  { value: "watching", text: "Watching", icon: "mdi-eye", color: "blue" },
  { value: "planned", text: "Planned", icon: "mdi-calendar-plus", color: "orange" },
  { value: "dropped", text: "Dropped", icon: "mdi-close", color: "red" },
  { value: "on_hold", text: "On Hold", icon: "mdi-pause", color: "yellow" },
  { value: "completed", text: "Completed", icon: "mdi-check", color: "green" },
  { value: null, text: "Unknown", icon: "mdi-help-circle", color: "grey" },
];

export default interface UserShowStatus {
  id?: number;
  show_id?: number;
  user_id?: number;
  status?: string;
}
