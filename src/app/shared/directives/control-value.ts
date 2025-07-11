import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Component, OnInit, Input, Output, ElementRef, EventEmitter, forwardRef, Directive } from '@angular/core';


export function NgValueProvider(klass: any) {
  return {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => klass),
    multi: true
  };
}

const noop = () => { };

@Directive({
    standalone: true,
    selector: '[appControlValue]'
  }
)
// tslint:disable-next-line:directive-class-suffix
export class ControlValue implements ControlValueAccessor {


  @Output() changed = new EventEmitter();
  // The internal data model
  innerValue: any = null;
  // Placeholders for the callbacks which are later provided
  // by the Control Value Accessor
  onTouchedCallback: () => void = noop;
  onChangeCallback: (_: any) => void = noop;

  // set value to actual ui Component using jquery or somthing
  setValue(v) {
    throw new Error('not implemented!');
  }

  onChange(v) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      this.onChangeCallback(v);
      this.changed.emit(this.innerValue);
    }
  }

  // get accessor
  get value(): any {
    return this.innerValue;
  }

  // set accessor including call the onchange callback
  set value(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      this.setValue(v);
      this.onChangeCallback(v);
    }
  }

  // Set touched on blur
  onBlur() {
    this.onTouchedCallback();
  }

  // From ControlValueAccessor interface
  writeValue(value: any) {
    if (value !== this.innerValue) {
      this.innerValue = value;
      this.setValue(value);
    }
  }

  // From ControlValueAccessor interface
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  // From ControlValueAccessor interface
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }
}
