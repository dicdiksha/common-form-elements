import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren
} from '@angular/core';
import {AsyncValidatorFactory, FieldConfig, FieldConfigInputType, FieldConfigValidationType, ThemeType} from '../common-form-config';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject, Subscription} from 'rxjs';
import {distinctUntilChanged, map, scan, tap} from 'rxjs/operators';

@Component({
  selector: 'sb-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit, OnChanges, OnDestroy {

  originData: any = [];
  sortedGradesArray: any = [];
  allClasses:any = [];
  allApiData:any = [];

  @Input() fieldTemplateClass?: String;
  @Output() initialize = new EventEmitter();
  @Output() finalize = new EventEmitter();
  @Output() linkClicked = new EventEmitter();
  @Output() valueChanges = new EventEmitter();
  @Output() statusChanges = new EventEmitter();
  @Output() labelClickEvent = new EventEmitter();
  @Output() formClickEvents = new EventEmitter();
  @Input() platform: 'mobile' | 'web' = 'web';
  @Output() dataLoadStatus = new EventEmitter<'LOADING' | 'LOADED'>();
  @Input() config;
  @Input() dataLoadStatusDelegate = new Subject<'LOADING' | 'LOADED'>();
  @Input() asyncValidatorFactory?: AsyncValidatorFactory;

  formGroup: FormGroup;

  FieldConfigInputType = FieldConfigInputType;
  ThemeType = ThemeType;
  private statusChangesSubscription: Subscription;
  private valueChangesSubscription: Subscription;
  private dataLoadStatusSinkSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder
  ) {
    if (!window['forms']) {
      window['forms'] = [];
    }
    window['forms'].push(this);
  }

  ngOnDestroy(): void {
    this.finalize.emit();

    if (this.statusChangesSubscription) {
      this.statusChangesSubscription.unsubscribe();
    }

    if (this.valueChangesSubscription) {
      this.valueChangesSubscription.unsubscribe();
    }

    if (this.dataLoadStatusSinkSubscription) {
      this.dataLoadStatusSinkSubscription.unsubscribe();
    }
  }

  gradeSorting(res: any){

    for(let i = 0; i < res.length; i++) {
      if(res[i].code == 'se_gradeLevels') {
        this.sortedGradesArray = res[i].templateOptions.options;
      }
    }

        let onlyClass: any = [];
        let noneClass: any = [];

        for(let i = 0; i < this.sortedGradesArray.length; i++) {
          if(this.sortedGradesArray[i].value.includes('class')) {
            onlyClass.push(this.sortedGradesArray[i]);
          }
          else {
            noneClass.push(this.sortedGradesArray[i]);
          }
        }
        
        let classArray: any = [{label: '', value: '', index: ''}];

        for(let i =0; i < onlyClass.length; i++) {
          let splittedValue = onlyClass[i].value.split(' ');
          let numberFound = splittedValue[1]

          classArray.push({
            label: onlyClass[i].label,
            value: onlyClass[i].value,
            index: numberFound
          })

        }

        classArray.sort((a:any,b:any)=>{
          return a.index - b.index;
        })

        noneClass.sort((a:any, b:any) =>{
          return a.value.localeCompare(b.value);
        })

        this.allClasses = classArray.concat(noneClass);
        
        for(let i = 0; i < this.allClasses.length; i++) {
          delete this.allClasses[i].index;
        }

        this.allClasses.shift();
        
        this.allApiData = res;

        for(let i =0; i < this.allApiData.length; i++) {
          if(this.allApiData[i].code == 'se_gradeLevels') {
            this.allApiData[i].templateOptions.options.splice(0, this.allClasses.length, ...this.allClasses) // deleting and adding new array
          } 
        }
  }

  ngOnInit() {
    this.gradeSorting(this.config) // sorting array
  }

  ngOnChanges(changes: SimpleChanges): void {
    
    this.gradeSorting(this.config) // sorting array

    if (changes['config']) {
      if ((changes['config'].currentValue && changes['config'].firstChange) || changes['config'].previousValue !== changes['config'].currentValue) {
        this.initializeForm();
      }
    }

    if (this.dataLoadStatusSinkSubscription) {
      this.dataLoadStatusSinkSubscription.unsubscribe();
    }

    if (this.statusChangesSubscription) {
      this.statusChangesSubscription.unsubscribe();
    }

    if (this.valueChangesSubscription) {
      this.valueChangesSubscription.unsubscribe();
    }

    this.dataLoadStatusSinkSubscription = this.dataLoadStatusDelegate.pipe(
      scan<'LOADING' | 'LOADED', { loadingCount: 0, loadedCount: 0 }>((acc, event) => {
        if (event === 'LOADED') {
          acc.loadedCount++;
          return acc;
        }

        acc.loadingCount++;
        return acc;
      }, {loadingCount: 0, loadedCount: 0}),
      map<{ loadingCount: 0, loadedCount: 0 }, 'LOADING' | 'LOADED'>((aggregates) => {
        if (aggregates.loadingCount !== aggregates.loadedCount) {
          return 'LOADING';
        }

        return 'LOADED';
      }),
      distinctUntilChanged(),
      tap((result) => {
        if (result === 'LOADING') {
          this.dataLoadStatus.emit('LOADING');
        } else {
          this.dataLoadStatus.emit('LOADED');
        }
      })
    ).subscribe();

    this.statusChangesSubscription = this.formGroup.statusChanges.pipe(
      tap((v) => {
        this.statusChanges.emit({
          isPristine: this.formGroup.pristine,
          isDirty: this.formGroup.dirty,
          isInvalid: this.formGroup.invalid,
          isValid: this.formGroup.valid
        });
      })
    ).subscribe();

    this.valueChangesSubscription = this.formGroup.valueChanges.pipe(
      tap((v) => {
        this.valueChanges.emit(v);
      })
    ).subscribe();
  }

  onNestedFormFinalize(nestedFormGroup: FormGroup, fieldConfig: FieldConfig<any>) {
    if (!this.formGroup.get('children') || !this.formGroup.get(`children.${fieldConfig.code}`)) {
      return;
    }

    (this.formGroup.get('children') as FormGroup).removeControl(fieldConfig.code);

    if (!Object.keys((this.formGroup.get('children') as FormGroup).controls).length) {
      this.formGroup.removeControl('children');
    }
  }

  onNestedFormInitialize(nestedFormGroup: FormGroup, fieldConfig: FieldConfig<any>) {

    if (!this.formGroup.get('children')) {
      this.formGroup.addControl('children', new FormGroup({}));
    }

    (this.formGroup.get('children') as FormGroup).removeControl(fieldConfig.code);
    (this.formGroup.get('children') as FormGroup).addControl(fieldConfig.code, nestedFormGroup);
  }

  private initializeForm() {
    if (!this.config.length) {
      console.error('FORM LIST IS EMPTY');
      return;
    }
    const formGroupData = {};
    this.config.forEach((element: any, index) => {
      if (element.type !== FieldConfigInputType.LABEL) {
        const formValueList = this.prepareFormValidationData(element, index);
        formGroupData[element.code] = formValueList;
      }
    });

    this.formGroup = this.formBuilder.group(formGroupData);
    this.initialize.emit(this.formGroup);
  }

  private prepareFormValidationData(element: FieldConfig<any>, index) {
    const formValueList = [];
    const validationList = [];

    let defaultVal: any = '';
    switch (element.type) {
      case FieldConfigInputType.INPUT:
        defaultVal = element.templateOptions.type === 'number' ?
          (element.default && Number.isInteger(element.default) ? element.default : 0) :
          (element.default && (typeof element.default) === 'string' ? element.default : '');
        break;
      case FieldConfigInputType.SELECT:
      case FieldConfigInputType.NESTED_SELECT:
        defaultVal = element.templateOptions.multiple ?
          (element.default && Array.isArray(element.default) ? element.default : []) : (element.default || null);
        break;
      case FieldConfigInputType.CHECKBOX:
        defaultVal = false || !!element.default;
        break;
    }

    formValueList.push(defaultVal);

    if (element.validations && element.validations.length) {
      element.validations.forEach((data, i) => {
        switch (data.type) {
          case FieldConfigValidationType.REQUIRED:
            if (element.type === FieldConfigInputType.CHECKBOX) {
              validationList.push(Validators.requiredTrue);
            } else if (element.type === FieldConfigInputType.SELECT || element.type === FieldConfigInputType.NESTED_SELECT) {
              validationList.push((c) => {
                if (element.templateOptions.multiple) {
                  return c.value && c.value.length ? null : 'error';
                }
                return !!c.value ? null : 'error';
              });
            } else {
              validationList.push(Validators.required);
            }
            break;
          case FieldConfigValidationType.PATTERN:
            validationList.push(Validators.pattern(element.validations[i].value as string));
            break;
          case FieldConfigValidationType.MINLENGTH:
            validationList.push(Validators.minLength(element.validations[i].value as number));
            break;
          case FieldConfigValidationType.MAXLENGTH:
            validationList.push(Validators.maxLength(element.validations[i].value as number));
            break;
        }
      });
    }

    formValueList.push(Validators.compose(validationList));

    return formValueList;
  }

  clickedLink(event) {
    this.linkClicked.emit(event);
  }

  labelEventClick(event) {
    this.labelClickEvent.emit(event);
  }
  formClickEventsHandler(event) {
    this.formClickEvents.emit(event);
  }
  
}
