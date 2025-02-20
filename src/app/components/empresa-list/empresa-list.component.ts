import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Empresa } from '../../models/empresa.model';
import { ButtonComponent } from '../button/button.component';
import { CreateCompanyModalComponent } from '../modal/modal.component';
import { EditCompanyModalComponent } from '../../edit-company-modal/edit-company-modal.component';

@Component({
  selector: 'app-empresa-list',
  standalone: true,
  // IMPORTANTE: Certifique-se de importar o componente de edição
  imports: [
    CommonModule,
    RouterModule,
    ButtonComponent,
    CreateCompanyModalComponent,
    EditCompanyModalComponent
  ],
  templateUrl: './empresa-list.component.html',
  styleUrls: ['./empresa-list.component.scss']
})
export class EmpresaListComponent implements OnInit {
  empresas: Empresa[] = [];
  loading: boolean = false;
  error: string | null = null;

  // Variável para controlar a exibição do modal de criação
  showCreateModal = false;
  // Variável para controlar a exibição do modal de edição
  showEditModal = false;
  // Guarda a empresa selecionada para edição
  selectedEmpresa: Empresa | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadEmpresas();
  }

  // Método para carregar a lista de empresas via API
  loadEmpresas(): void {
    this.loading = true;
    this.apiService.getEmpresas().subscribe({
      next: data => {
        this.empresas = data;
        this.loading = false;
      },
      error: err => {
        console.error('Erro ao buscar empresas:', err);
        this.error = 'Erro ao buscar empresas';
        this.loading = false;
      }
    });
  }

  // Método para alternar a exibição dos sócios (expansão)
  public toggleEmpresa(empresa: Empresa): void {
    empresa.open = !empresa.open;
    // Se estiver abrindo e os sócios ainda não foram carregados, faça a chamada
    if (empresa.open && !empresa.socios) {
      this.apiService.getSocios(empresa.id).subscribe(socios => {
        empresa.socios = socios;
      });
    }
  }

  public deleteEmpresa(empresa: Empresa, event: Event): void {
    // Impede que o clique se propague para o toggle
    event.stopPropagation();
    
    // Solicita confirmação ao usuário antes de deletar
    if (confirm('Você tem certeza que deseja deletar esta empresa?')) {
      // Chama o método do ApiService para deletar a empresa do backend
      this.apiService.deleteEmpresa(empresa.id).subscribe({
        next: () => {
          // Se a deleção for bem-sucedida, atualiza a lista removendo a empresa deletada
          this.empresas = this.empresas.filter(e => e.id !== empresa.id);
        },
        error: err => {
          console.error('Erro ao deletar empresa:', err);
          // Você pode exibir uma mensagem de erro ao usuário se desejar
        }
      });
    }
  }

  // Método chamado quando o botão "Cadastrar Empresa" é clicado (abre modal de criação)
  openCreateModal(): void {
    this.showCreateModal = true;
  }

  // Fecha o modal de criação
  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  // Quando o modal de criação emite um evento com a nova empresa criada, adiciona à lista
  onCompanyCreated(novaEmpresa: Empresa): void {
    this.empresas.push(novaEmpresa);
  }

  // Método para abrir o modal de edição.
  // Recebe o objeto 'empresa' e o evento; usa stopPropagation para evitar conflito com o toggle.
  public editEmpresa(empresa: Empresa, event?: Event): void {
    if (event) {
      event.stopPropagation(); // Impede que o clique no botão de edição acione também o toggle da empresa.
    }
    // Copia a empresa para que você possa editar sem alterar imediatamente a lista
    this.selectedEmpresa = { ...empresa };
    this.showEditModal = true;
  }

  // Quando o modal de edição emite o evento com a empresa atualizada, atualize a lista e chame o serviço de atualização
  onCompanyUpdated(updatedEmpresa: Empresa): void {
    // Chamada para atualizar o banco de dados via API
    this.apiService.updateEmpresa(updatedEmpresa.id, updatedEmpresa).subscribe({
      next: (resp) => {
        // Atualiza o item na lista
        const index = this.empresas.findIndex(e => e.id === updatedEmpresa.id);
        if (index !== -1) {
          this.empresas[index] = resp; // resp deve ser a empresa atualizada
        }
      },
      error: (err) => {
        console.error('Erro ao atualizar empresa:', err);
      }
    });
  }

  // Fecha o modal de edição e limpa a empresa selecionada
  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedEmpresa = null;
  }

  // Placeholder para cadastrar sócio
  handleSubmit(event: Event): void {
    console.log('Cadastrar Sócio acionado', event);
    // Implementar a lógica para cadastrar um sócio ou abrir o modal de cadastro de sócio
  }
}
