import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoclisteComponent } from './docliste.component';

describe('DoclisteComponent', () => {
  let component: DoclisteComponent;
  let fixture: ComponentFixture<DoclisteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DoclisteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DoclisteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
