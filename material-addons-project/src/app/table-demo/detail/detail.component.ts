import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {ToolbarService} from "@porscheinformatik/material-addons";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent {

  demoId;

  today = new Date();

  demoIdData = 'John Doe';
  textIsEditable = false;
  demoPx = '16px';

  selectIsEditable = true;

  visibleFromDate = new Date();
  dateIsEditable = true;

  autoCompleteIsEditable = true;
  autoCompleteValue= 'Three';
  options: string[] = ['One', 'Two', 'Three'];


  detailData: any = {};

  constructor(private route: ActivatedRoute, private snackBar: MatSnackBar, private toolbarService: ToolbarService) {

    this.toolbarService.addBackAction('/tableDemo');

    this.route.paramMap.subscribe(params => {
      const demoId = params.get('demoId');
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
      'Ok', {duration: 3000});
    window.history.back();
  }
}
