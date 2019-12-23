import { Component, Inject, Input } from '@angular/core';
import { Challenge, Reviewer } from '../../../../../core/domain/modules';
import { AuthService } from '../../../../../core/services/auth.service';
import { ChallengeService } from '../../../../../core/services/challenge.service';
import { MatDialog } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SelectReviewerDialogComponent } from '../../../../../shared/component/select-reviewer-dialog/select-reviewer-dialog.component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-meta-section-component',
  templateUrl: './meta-section-component.html',
  styleUrls: ['./meta-section-component.scss']
})
export class MetaSectionComponent {
  @Input()
  challenge: Challenge;

  btnOpts: MatProgressButtonOptions = {
    active: false,
    text: 'Edit Reviewers',
    spinnerSize: 19,
    raised: true,
    stroked: false,
    fullWidth: false,
    disabled: false,
    mode: 'indeterminate'
  };

  constructor(
    private authService: AuthService,
    private challengeService: ChallengeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer,
    @Inject(DOCUMENT) private document: any
  ) {}

  editReviewers() {
    const dialogRef = this.dialog.open(SelectReviewerDialogComponent, {
      width: '40vw',
      data: {}
    });

    dialogRef.afterClosed().subscribe((reviewers: Reviewer[]) => {
      if (reviewers) {
        this.challenge.reviewers = reviewers;

        this.challengeService.update(this.challenge).subscribe();
      }
    });
  }
}