import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  forwardRef,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Directive({
  selector: '[MaskDefault]',
   providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MaskDirective),
      multi: true,
    },
  ],
})
export class MaskDirective implements ControlValueAccessor {

    @Input('MaskDefault') maskType: 'cpf' | 'cnpj' | 'phone' | 'cep' = 'cpf';

  private onChange = (_: any) => {};
  private onTouched = () => {};

  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    const numericValue = value.replace(/\D/g, '');
    let formatted = numericValue;

    switch (this.maskType) {
      case 'cpf':
        formatted = this.formatCPF(numericValue);
        break;
      case 'cnpj':
        formatted = this.formatCNPJ(numericValue);
        break;
      case 'phone':
        formatted = this.formatTelefone(numericValue);
        break;
      case 'cep':
        formatted = this.formatCEP(numericValue);
        break;
    }

    this.el.nativeElement.value = formatted;
    this.onChange(numericValue); 
  }

  @HostListener('blur')
  onBlur() {
    this.onTouched();
  }

  writeValue(value: any): void {
    if (value === null || value === undefined) {
      this.el.nativeElement.value = '';
    } else {
      const formatted = this.formatValue(value);
      this.el.nativeElement.value = formatted;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  private formatValue(value: string): string {
    const numeric = value.replace(/\D/g, '');
    switch (this.maskType) {
      case 'cpf': return this.formatCPF(numeric);
      case 'cnpj': return this.formatCNPJ(numeric);
      case 'phone': return this.formatTelefone(numeric);
      case 'cep': return this.formatCEP(numeric);
      default: return value;
    }
  }

  private formatCPF(value: string): string {
    return value.replace(/^(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4').slice(0, 14);
  }

  private formatCNPJ(value: string): string {
    return value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, '$1.$2.$3/$4-$5').slice(0, 18);
  }

  private formatTelefone(value: string): string {
    if (value.length <= 10) {
      return value.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').slice(0, 14);
    }
    return value.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').slice(0, 15);
  }

  private formatCEP(value: string): string {
    return value.replace(/^(\d{5})(\d{0,3})/, '$1-$2').slice(0, 9);
  }
}
