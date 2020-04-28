import {TimedError} from './timed-error';

export class ErrorOccoured {
  static readonly type = '[Error] ErrorOccoured';

  constructor(public error: TimedError) {}
}

export class ErrorRegisteredByUser {
  static readonly type = '[Error] ErrorRegisteredByUser';

  constructor(public error: TimedError) {}
}
