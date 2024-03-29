# SunbirdEdForms

Contains  Form component powered by angular 11.2.14 . This component expects a configuration and renders form according to the view.

# Getting Started

## Step 1: Install the package

    npm install common-form-elements --save

## Step 2: Include the library selector in view( Eg .HTML file)
   
   <sb-form [config]='config'></sb-form>

## step3: Form component emits values on every input , To get value include event callbacks
 
  <sb-form (valueChanges)="function($event)" (statusChanges)="function($event)" ></sb-form>
  
## Steps to Integrate the form

Please refer following link for sample config

https://github.com/Sunbird-Ed/SunbirdEd-forms/blob/release-4.1.0/projects/common-form-elements/src/lib/form/form.component.ts
   
The Form Can render following elements:


* Text Box
* Text Area
* Drop Down (Single)
* Multi Select Drop Down

Drop Down Data Sources:
Drop Down can be provided with multiple types of Data Sources:
* Static List
* Closure which is called as MARKER in above config (A function which returns Promise of FieldConfig)
* API Source - Currently Not Developed (Open For Contribution)



Example of Closure Implementation

```
buildStateListClosure(config: FieldConfig<any>, initial = false): FieldConfigOptionsBuilder<Location> {
    return (formControl: FormControl, _: FormControl, notifyLoading, notifyLoaded) => {
      return defer(async () => {
        const req: LocationSearchCriteria = {
          from: CachedItemRequestSourceFrom.SERVER,
          filters: {
            type: LocationType.TYPE_STATE
          }
        };
        notifyLoading();
        return this.fetchUserLocation(req)
          .then((stateLocationList: Location[]) => {
            notifyLoaded();
            const list = stateLocationList.map((s) => ({ label: s.name, value: s }));
            if (config.default && initial) {
              const option = list.find((o) => o.value.id === config.default.id || o.label === config.default.name);
              formControl.patchValue(option ? option.value : null, { emitModelToViewChange: false });
              formControl.markAsPristine();
              config.default['code'] = option ? option.value['code'] : config.default['code'];
            }
            initial = false;
            return list;
          })
          .catch((e) => {
            notifyLoaded();
            this.commonUtilService.showToast('NO_DATA_FOUND');
            console.error(e);
            return [];
          });
      });
    };
  }
```
 The Logic Inside can be customised to own needs of project.
 
Function Signature should be as follows:

```
functionName(config: FieldConfig<any>, initial = false): FieldConfigOptionsBuilder<T>
```


## Versions
|   release branch  | npm package version | Angular Version |
|:-----------------:|:-------------------:|:---------------:|
| release-5.0.1     |        5.0.1        |      Ng V9      |
| release-5.1.0_v10 |        5.1.0        |      Ng V10     |
| release-5.1.0_v11 |        5.1.1        |      Ng V11     |




## Latest Installation, Build and Publish Process 2024

##Installation
1. Go inside folder and use npm command to install npm dependency (npm i).
2. Check suitable node version in package.json in face any error during installation.

##Build
1. Upgrade package version
2. Use command :  npm run build common-form-elements

##Publish 
1. Go inside /dist folder /dist/common-form-elements/*
2. Use command : npm publish  OR npm publish --access=public
3. Use credentials if asked 
4. Check deployed version https://www.npmjs.com/package/@dicdikshaorg/common-form-elements?activeTab=versions 