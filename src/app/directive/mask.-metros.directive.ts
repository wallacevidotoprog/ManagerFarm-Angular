import { Directive, HostListener, ElementRef, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[SquareMeters]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SquareMetersDirective),
      multi: true
    }
  ]
})
export class SquareMetersDirective implements ControlValueAccessor {
private onChange = (_: any) => {};
  private onTouched = () => {};

  constructor(private el: ElementRef<HTMLInputElement>) {}

  writeValue(value: number): void {
    if (value === null || value === undefined || isNaN(value)) {
      this.el.nativeElement.value = '';
    } else {
      this.el.nativeElement.value = `${value.toFixed(3)} m²`;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.el.nativeElement.disabled = isDisabled;
  }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string): void {
    const numericValue = parseFloat(value.replace(/[^0-9.,]/g, '').replace(',', '.'));
    this.onChange(isNaN(numericValue) ? null : numericValue);
  }

  @HostListener('blur')
  onBlur(): void {
    this.onTouched();
    const value = this.el.nativeElement.value;
    const numericValue = parseFloat(value.replace(/[^0-9.,]/g, '').replace(',', '.'));
    if (isNaN(numericValue)) {
      this.el.nativeElement.value = '';
    } else {
      this.el.nativeElement.value = `${numericValue.toFixed(3)} m²`;
    }
  }
}
