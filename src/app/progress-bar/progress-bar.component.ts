import { Component, Input } from "@angular/core";

@Component({
  selector: "app-progress-bar",
  templateUrl: "./progress-bar.component.html",
  styleUrls: ["./progress-bar.component.scss"],
})
export class ProgressBarComponent {
  @Input() subtasks: any[] = [];

  calculateProgressPercentage(subtasks: any[]): number {
    if (!subtasks || subtasks.length === 0) return 0;
    const completed = this.countCompletedSubtasks(subtasks);
    return (completed / subtasks.length) * 100;
  }

  countCompletedSubtasks(subtasks: any[]): number {
    return subtasks.filter((subtask) => subtask.is_completed).length;
  }
}
