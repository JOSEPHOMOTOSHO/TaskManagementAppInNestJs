import { BadRequestException, PipeTransform } from '@nestjs/common';
import { TaskStatus } from '../task.model';

export class taskUpdateValidation implements PipeTransform {
  readonly allowedStatuses = [
    TaskStatus.DONE,
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
  ];
  transform(value: any) {
    value = value.toUpperCase();

    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`${value} is not a valid status `);
    }

    return value;
  }

  private isStatusValid(status: any) {
    const indexOfStatus = this.allowedStatuses.indexOf(status);
    return indexOfStatus !== -1;
  }
}
