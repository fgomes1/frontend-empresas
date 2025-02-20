import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-socio-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-socio-modal.component.html',
  styleUrls: ['./create-socio-modal.component.scss']
})
export class CreateSocioModalComponent {
  @Output() closeModal = new EventEmitter<void>();
  @Output() socioCreated = new EventEmitter<any>();

  // Formulário reativo para cadastrar sócio. Aqui, estamos considerando apenas o nome.
  socioForm: FormGroup = new FormGroup({
    nome: new FormControl('', [Validators.required])
    // Adicione outros campos se necessário, como cargo, contato, etc.
  });

  onSubmit(): void {
    if (this.socioForm.valid) {
      // Emite os dados do novo sócio para o componente pai
      this.socioCreated.emit(this.socioForm.value);
      // Fecha o modal
      this.closeModal.emit();
    }
  }

  onCancel(): void {
    this.closeModal.emit();
  }
}
