import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthService} from '../../../../core/services/auth.service';
import {Challenge, CodeFile, CodeLine, Comment} from '../../../../core/domain/modules';
import {CodeFileService} from '../../../../core/services/code-file.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SNACKBOX_MESSAGE_FAILURE, SNACKBOX_MESSAGE_SUCCESS} from '../../../../core/constants';
import {CommentService} from '../../../../core/services/comment.service';

import uuidv1 from "uuid/v1";

@Component({
  selector: 'app-code-line-component',
  templateUrl: './code-line.component.html',
  styleUrls: ['./code-line.component.scss']
})
export class CodeLineComponent implements OnInit {
  @Input()
  codeFile: CodeFile;

  @Input()
  challenge: Challenge;

  @Input()
  codeLine: CodeLine;

  @Input()
  lineNumber: number;

  @Output()
  codeLineChange = new EventEmitter();

  showReplyBox: boolean;

  showCommentBox: boolean;

  replyContent: string;

  constructor(
    private commentService: CommentService,
    private authService: AuthService,
    private codeFileService: CodeFileService,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit() {
  }

  showCommentOrReplyBox() {
    if (this.codeLine.comments.length >= 1) {
      this.showReplyBox = !this.showReplyBox;
    } else {
      this.showCommentBox = !this.showCommentBox;
    }
  }

  addNewComment(editorContent) {
    const comment: Comment = {
      id: uuidv1(),
      firebaseUser: this.authService.getUser(),
      body: editorContent,
      codeLineId: this.codeLine.id
    };

    this.replyContent = '';
    this.showReplyBox = false;
    this.showCommentBox = false;

    this.codeLine.comments.push(comment);

    this.commentService.save(comment).subscribe(
      (codeFile: CodeFile) => {

        this.codeFile = codeFile;

        this.snackBar.open(SNACKBOX_MESSAGE_SUCCESS);
      },
      () => {
        this.snackBar.open(SNACKBOX_MESSAGE_FAILURE);
      }
    );
  }

  showBackground(): boolean {
    if (this.codeLine.comments.length >= 1) {
      return true;
    } else {
      return this.showReplyBox ? true : this.showCommentBox;
    }
  }
}
