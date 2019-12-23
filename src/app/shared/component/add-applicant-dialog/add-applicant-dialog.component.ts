import { Component, Inject, NgZone } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Challenge, Reviewer } from '../../../core/domain/modules';
import { Observable } from 'rxjs';
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { ChallengeService } from '../../../core/services/challenge.service';
import { ReviewerService } from '../../../core/services/reviewer.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-delete-confirm-dialog',
  templateUrl: './add-applicant-dialog.component.html',
  styleUrls: ['./add-applicant-dialog.component.scss']
})
export class AddApplicantDialogComponent {
  levels: string[] = ['Intern', 'Junior', 'Intermediate', 'Senior'];

  positions: string[] = ['Frontend engineer', 'Backend engineer', 'Tech team'];

  reviewers: Observable<Reviewer[]> = new Observable<Reviewer[]>();

  btnOpts: MatProgressButtonOptions = {
    active: false,
    text: 'Import',
    spinnerSize: 19,
    raised: false,
    stroked: false,
    fullWidth: false,
    disabled: false,
    mode: 'indeterminate'
  };

  challenge: Challenge = {};

  constructor(
    private challengeService: ChallengeService,
    private reviewerService: ReviewerService,
    private snackBar: MatSnackBar,
    private _ngZone: NgZone,
    private dialogRef: MatDialogRef<AddApplicantDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Reviewer
  ) {
    this.reviewers = this.reviewerService.findAll();
  }

  onNoClick() {
    this.dialogRef.close();
  }

  import() {
    this.dialogRef.close();

    this.snackBar.open('Working');
    this.btnOpts.active = true;

    this.challengeService.create(this.challenge).subscribe(
      result => {
        this.btnOpts.active = false;

        this.snackBar.open('Import success', null, {
          duration: 5 * 1000
        });

        this.challenge = {};
      },
      error => {
        this.btnOpts.active = false;

        this.snackBar.open('Import failed', null, {
          duration: 5 * 1000
        });
      }
    );
  }
}