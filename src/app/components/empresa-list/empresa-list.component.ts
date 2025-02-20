import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Empresa } from '../../models/empresa.model';
import { ButtonComponent } from '../button/button.component';
import { CreateCompanyModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-empresa-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonComponent,
    CreateCompanyModalComponent
  ],
  templateUrl: './empresa-list.component.html',
  styleUrls: ['./empresa-list.component.scss']
})
export class EmpresaListComponent implements OnInit {
  empresas: Empresa[] = [];
  loading: boolean = false;
  error: string | null = null;

  // Controla a exibição do modal
  showModal = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
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

  public toggleEmpresa(empresa: Empresa): void {
    empresa.open = !empresa.open;
    if (empresa.open && !empresa.socios) {
      this.apiService.getSocios(empresa.id).subscribe(socios => {
        empresa.socios = socios;
      });
    }
  }

  // Abre o modal ao clicar em "Cadastrar Empresa"
  openModal(): void {
    this.showModal = true;
  }

  // Fecha o modal (chamado pelo modal via Output)
  closeModal(): void {
    this.showModal = false;
  }

  // Recebe os dados da nova empresa criados no modal
  onCompanyCreated(novaEmpresa: any): void {
    // Adiciona à lista local de empresas
    this.empresas.push(novaEmpresa);
  }

  handleSubmit(event: Event): void {
    console.log('Cadastrar Sócio acionado', event);
    // Implemente a lógica para cadastrar um sócio ou abrir o modal de sócio
  }
}