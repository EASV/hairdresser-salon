import {Action, Actions, Selector, State, StateContext, Store} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {ErrorOccoured, ErrorRegisteredByUser} from './error.action';
import {TimedError} from './timed-error';

export class ErrorStateModel {
  errors: TimedError[];
}

@State<ErrorStateModel>({
  name: 'error',
  defaults: {
    errors: []
  }
})
@Injectable()
export class ErrorState {
  constructor() {}

  @Selector()
  static errors(state: ErrorStateModel) {
    return state.errors;
  }

  @Action(ErrorOccoured)
  errorOccoured({getState, patchState, dispatch}: StateContext<ErrorStateModel>, action: ErrorOccoured) {
    let errors = getState().errors;
    action.error.time = Date.now();
    errors = [...errors];
    errors.push(action.error);
    patchState({
      errors
    });
  }

  @Action(ErrorRegisteredByUser)
  errorRegisteredByUser({getState, patchState, dispatch}: StateContext<ErrorStateModel>, action: ErrorOccoured) {
    const errors = getState().errors.filter(error =>
      !this.errorsEquals(error, action.error));
    patchState({
      errors
    });
  }

  errorsEquals(error1: TimedError, error2: TimedError): boolean {
    return error1.name === error2.name &&
      error1.time === error2.time;
  }
}




