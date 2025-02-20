import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Importa o RouterModule
import { ApiService } from '../../services/api.service';
import { Empresa } from '../../models/empresa.model';

@Component({
  selector: 'app-empresa-list',
  standalone: true,
  imports: [CommonModule, RouterModule], // Adicione o RouterModule aqui
  templateUrl: './empresa-list.component.html',
  styleUrls: ['./empresa-list.component.scss']
})
export class EmpresaListComponent implements OnInit {
  empresas: Empresa[] = [];
  loading: boolean = false;
  error: string | null = null;

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
}
