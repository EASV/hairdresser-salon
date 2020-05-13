import {Subject} from 'rxjs';
import {UploadData} from './upload-data';

export class UploadBehaviour {
  uid: string;
  percentageChanged = new Subject<UploadData>();
  uploadComplete = new Subject<UploadData>();
  cancelUpload = new Subject();
}
