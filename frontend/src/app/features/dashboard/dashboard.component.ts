import { Component, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import {
  ApexAxisChartSeries, ApexNonAxisChartSeries, ApexChart, ApexXAxis,
  ApexDataLabels, ApexFill, ApexStroke, ApexPlotOptions, ApexLegend,
  ApexGrid, ApexTooltip, NgApexchartsModule,
} from 'ng-apexcharts';
import { DashboardService } from '../../core/services/dashboard.service';
import { AuthService } from '../../core/services/auth.service';
import { DashboardData } from '../../core/models';
import { KpiCardComponent } from '../../shared/kpi-card/kpi-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DecimalPipe, NgApexchartsModule, KpiCardComponent],
  template: `
    <div class="space-y-6">
      <div class="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 class="section-title">Tableau de bord</h1>
          <p class="mt-1 text-sm text-slate-500">Vue d'ensemble de la gestion des bourses · {{ user()?.nom_complet }}</p>
        </div>
        <span class="chip">⏱️ Données en temps réel</span>
      </div>

      @if (data(); as d) {
        <!-- ===== KPI ===== -->
        <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <app-kpi-card label="Étudiants" [value]="d.cartes.etudiants" icon="🎓" accent="blue" />
          <app-kpi-card label="Demandes" [value]="d.cartes.demandes" icon="📄" accent="violet" />
          <app-kpi-card label="Bourses accordées" [value]="d.cartes.demandes_acceptees" icon="✅" accent="dgbe"
            [hint]="taux(d) + '% acceptées'" />
          <app-kpi-card label="Réclamations ouvertes" [value]="d.cartes.reclamations_ouvertes" icon="📨" accent="amber" />
        </div>

        <!-- Montant distribué (carte large dégradée) -->
        <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-dgbe-600 to-dgbe-800 p-6 text-white shadow-card">
          <div class="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
          <div class="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <div class="text-sm font-medium text-dgbe-100">Montant total distribué</div>
              <div class="mt-1 font-display text-4xl font-extrabold">{{ d.cartes.montant_total_distribue | number:'1.0-0' }} <span class="text-2xl">FCFA</span></div>
            </div>
            <div class="flex gap-6 text-center">
              <div><div class="text-2xl font-bold">{{ d.cartes.paiements }}</div><div class="text-xs text-dgbe-100">Paiements</div></div>
              <div class="border-l border-white/20"></div>
              <div><div class="text-2xl font-bold">{{ d.cartes.reclamations }}</div><div class="text-xs text-dgbe-100">Réclamations</div></div>
            </div>
          </div>
        </div>

        <!-- ===== GRAPHIQUES (SVG ApexCharts) ===== -->
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div class="card p-5 lg:col-span-2">
            <h2 class="mb-1 font-semibold text-slate-800">Paiements mensuels</h2>
            <p class="mb-2 text-xs text-slate-400">Montant versé par mois (FCFA)</p>
            <apx-chart [series]="airSeries" [chart]="airChart" [xaxis]="airX" [dataLabels]="noLabels"
              [stroke]="airStroke" [fill]="airFill" [grid]="grid" [tooltip]="tooltipFcfa" [colors]="['#0f904c']" />
          </div>
          <div class="card p-5">
            <h2 class="mb-1 font-semibold text-slate-800">Répartition par statut</h2>
            <p class="mb-2 text-xs text-slate-400">Demandes de bourse</p>
            <apx-chart [series]="donutSeries" [chart]="donutChart" [labels]="donutLabels"
              [legend]="legendBottom" [colors]="palette" [dataLabels]="pieLabels" [plotOptions]="donutPlot" />
          </div>
        </div>

        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div class="card p-5">
            <h2 class="mb-1 font-semibold text-slate-800">Demandes par région</h2>
            <p class="mb-2 text-xs text-slate-400">Top régions</p>
            <apx-chart [series]="regionSeries" [chart]="barChartH" [xaxis]="regionX" [dataLabels]="noLabels"
              [plotOptions]="barPlotH" [grid]="grid" [colors]="['#1ab35f']" [tooltip]="tooltipDefault" />
          </div>
          <div class="card p-5">
            <h2 class="mb-1 font-semibold text-slate-800">Demandes par université</h2>
            <p class="mb-2 text-xs text-slate-400">Établissements</p>
            <apx-chart [series]="univSeries" [chart]="barChartV" [xaxis]="univX" [dataLabels]="noLabels"
              [plotOptions]="barPlotV" [grid]="grid" [colors]="['#e0a82e']" [tooltip]="tooltipDefault" />
          </div>
        </div>
      } @else {
        <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
          @for (i of [1,2,3,4]; track i) { <div class="card h-28 animate-pulse bg-slate-100/60"></div> }
        </div>
        <div class="card h-80 animate-pulse bg-slate-100/60"></div>
      }
    </div>
  `,
})
export class DashboardComponent {
  private service = inject(DashboardService);
  private auth = inject(AuthService);
  user = this.auth.currentUser;
  data = signal<DashboardData | null>(null);

  palette = ['#1ab35f', '#0f904c', '#3fcd7c', '#0d723f', '#79e4a3', '#e0a82e', '#aff1c5'];

  // Configs ApexCharts (rendu SVG)
  airChart: ApexChart = { type: 'area', height: 300, toolbar: { show: false }, fontFamily: 'Inter', sparkline: { enabled: false } };
  airStroke: ApexStroke = { curve: 'smooth', width: 3 };
  airFill: ApexFill = { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05, stops: [0, 90] } };
  barChartH: ApexChart = { type: 'bar', height: 300, toolbar: { show: false }, fontFamily: 'Inter' };
  barChartV: ApexChart = { type: 'bar', height: 300, toolbar: { show: false }, fontFamily: 'Inter' };
  donutChart: ApexChart = { type: 'donut', height: 300, fontFamily: 'Inter' };
  barPlotH: ApexPlotOptions = { bar: { horizontal: true, borderRadius: 6, barHeight: '60%' } };
  barPlotV: ApexPlotOptions = { bar: { horizontal: false, borderRadius: 6, columnWidth: '55%' } };
  donutPlot: ApexPlotOptions = { pie: { donut: { size: '68%' } } };
  noLabels: ApexDataLabels = { enabled: false };
  pieLabels: ApexDataLabels = { enabled: true, formatter: (val: number) => `${Math.round(val)}%` };
  legendBottom: ApexLegend = { position: 'bottom', fontFamily: 'Inter' };
  grid: ApexGrid = { borderColor: '#eef2f7', strokeDashArray: 4 };
  tooltipDefault: ApexTooltip = { theme: 'light' };
  tooltipFcfa: ApexTooltip = { theme: 'light', y: { formatter: (v: number) => `${v.toLocaleString('fr-FR')} FCFA` } };

  airSeries: ApexAxisChartSeries = [];
  airX: ApexXAxis = {};
  regionSeries: ApexAxisChartSeries = [];
  regionX: ApexXAxis = {};
  univSeries: ApexAxisChartSeries = [];
  univX: ApexXAxis = {};
  donutSeries: ApexNonAxisChartSeries = [];
  donutLabels: string[] = [];

  constructor() {
    this.service.get().subscribe((res) => {
      const d = res.data;
      this.data.set(d);

      this.airSeries = [{ name: 'Paiements', data: Object.values(d.paiements_mensuels) }];
      this.airX = { categories: Object.keys(d.paiements_mensuels), labels: { style: { colors: '#94a3b8' } } };

      this.donutLabels = Object.keys(d.demandes_par_statut);
      this.donutSeries = Object.values(d.demandes_par_statut);

      this.regionSeries = [{ name: 'Demandes', data: Object.values(d.demandes_par_region) }];
      this.regionX = { categories: Object.keys(d.demandes_par_region), labels: { style: { colors: '#94a3b8' } } };

      this.univSeries = [{ name: 'Demandes', data: Object.values(d.demandes_par_universite) }];
      this.univX = { categories: Object.keys(d.demandes_par_universite), labels: { style: { colors: '#94a3b8' } } };
    });
  }

  taux(d: DashboardData): number {
    return d.cartes.demandes ? Math.round((d.cartes.demandes_acceptees / d.cartes.demandes) * 100) : 0;
  }
}
