import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { ToolbarService } from 'src/app/components/toolbar/toolbar.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent {

  demoId;

  detailData: any = {};

  constructor(private route: ActivatedRoute, private snackBar: MatSnackBar, private toolbarService: ToolbarService) {

    this.toolbarService.addBackAction('/tableDemo');

    this.route.paramMap.subscribe(params => {
      let demoId = params.get('demoId');
      if (demoId) {
        this.demoId = demoId;

        this.toolbarService.setDataTitle('ID ' + demoId);

        this.toolbarService.addToolbarAction({
          matIcon: 'delete',
          i18nActionKey: 'Delete',
          action: () => {
            alert('Deleteeeeee');
          }
        });
      }
    });
  }

  public save() {
    this.snackBar.open('That one would be saved!',
      'Ok', { duration: 3000 });
    window.history.back();
  }
}
