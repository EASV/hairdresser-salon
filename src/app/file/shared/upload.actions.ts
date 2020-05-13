import {UploadData} from './upload-data';

export class UploadFile {
  static readonly type = '[File] UploadFile';

  constructor(public uid: string, public file: File) {}
}

export class UploadCompleteRegistered {
  static readonly type = '[File] UploadCompleteRegistered';

  constructor(public uid: string) {}
}

export class UploadComplete {
  static readonly type = '[File] UploadComplete';

  constructor(public upload: UploadData) {}
}

export class UploadPercentChanged {
  static readonly type = '[File] UploadPercentChanged';

  constructor(public upload: UploadData) {}
}

export class DeleteFile {
  static readonly type = '[File] DeleteFile';

  constructor(public uid: string) {}
}

export class CancelUpload {
  static readonly type = '[File] CancelUpload';

  constructor(public uid: string) {}
}


