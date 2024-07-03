import { Component } from '@angular/core';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-no-results',
  templateUrl: './no-results.component.html',
  styleUrls: [ './no-results.component.scss' ],
})
export class NoResultsComponent {
  public readonly assetsPrefix: string = environment.assets.prefix + '/img';
  public readonly noResultsImgUrl: string = this.assetsPrefix + '/no-results.png';
}
