import { MadButtonGroupComponent } from './mad-button-group.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('MadButtonGroupComponent', () => {
  let component: MadButtonGroupComponent;
  let fixture: ComponentFixture<MadButtonGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MadButtonGroupComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MadButtonGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have class mad-button-group', () => {
    const hostElement = fixture.nativeElement;
    const className = hostElement.className;
    expect(className).toEqual('mad-button-group');
  });
});
