import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

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
  @Input('MaskDefault') maskType:
    | 'cpf'
    | 'rg'
    | 'cnh'
    | 'cnpj'
    | 'phone'
    | 'real'
    | 'metro'
    | 'cep' = 'cpf';

  private onChange = (_: any) => {};
  private onTouched = () => {};

  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    const numericValue = value.replace(/\D/g, '');
    let formatted = '';
    let valueToEmit: any = numericValue;

    switch (this.maskType) {
      case 'cpf':
        formatted = this.formatCPF(numericValue);
        break;
      case 'rg':
        formatted = this.formatRG(numericValue);
        break;
      case 'cnh':
        formatted = this.formatCNH(numericValue);
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
      case 'real':
        // formatted = this.formatREAL(numericValue);
        formatted = this.formatREAL(numericValue);
        valueToEmit = parseFloat(numericValue) / 100;
        break;
      case 'metro':
        formatted = this.formatMetro(numericValue);
        valueToEmit = parseFloat(value.replace(',', '.'));
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
    const strValue = (value ?? '').toString(); // garante string
    const numeric = strValue.replace(/\D/g, '');
    console.log('formatValue', strValue, numeric);

    switch (this.maskType) {
      case 'cpf':
        return this.formatCPF(numeric);
      case 'cnpj':
        return this.formatCNPJ(numeric);
      case 'phone':
        return this.formatTelefone(numeric);
      case 'cep':
        return this.formatCEP(numeric);
      case 'real':
        return this.formatREAL(numeric);
      case 'rg':
        return this.formatRG(numeric);
      case 'cnh':
        return this.formatCNH(numeric);
      case 'metro':
        return this.formatMetro(strValue);
      default:
        return value;
    }
  }
  private formatREAL(value: string): string {
    const nub = parseFloat(value) / 100;
    const formatted = nub.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
    return formatted;
  }
  private formatCPF(value: string): string {
    return value
      .replace(/^(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4')
      .slice(0, 14);
  }
  private formatRG(value: string): string {
    return value
      .replace(/^(\d{2})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4')
      .slice(0, 12);
  }
  private formatCNH(value: string): string {
    return value
      .replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')
      .slice(0, 14);
  }
  private formatCNPJ(value: string): string {
    return value
      .replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, '$1.$2.$3/$4-$5')
      .slice(0, 18);
  }
  private formatTelefone(value: string): string {
    if (value.length <= 10) {
      return value
        .replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
        .slice(0, 14);
    }
    return value.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').slice(0, 15);
  }
  private formatCEP(value: string): string {
    return value.replace(/^(\d{5})(\d{0,3})/, '$1-$2').slice(0, 9);
  }
  private formatMetro(value: string): string {
    const clean = value.replace(/[^\d.,]/g, '').replace(',', '.');
    const num = parseFloat(clean);

    if (isNaN(num)) return '';

    const formatted = num.toLocaleString('pt-BR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 5,
    });

    return `${formatted} m²`;
  }
}
