import { Component, computed, signal } from '@angular/core';
import { ItemRow } from './components/item-row';
import { Stepper } from './components/stepper';
import { ITEMS, JUMLAH_ORANG, PAJAK_PERSEN } from './data/menu';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [ItemRow, Stepper, DatePipe, CurrencyPipe, FormsModule],
  templateUrl: './app.html',
})
export class App {
  protected readonly tanggal = new Date(2026, 11, 18);
  protected readonly items = signal(ITEMS);
  protected setQty(id: number, qty: number) {
    this.items.update((list) => list.map((i) => (i.id === id ? { ...i, qty } : i)));
  }
  protected readonly namaBaru = signal('');
  protected readonly hargaBaru = signal<number | null>(null);
  protected readonly jumlahOrang = signal(JUMLAH_ORANG);
  protected readonly pajakPersen = signal(PAJAK_PERSEN);

  protected readonly subtotal = computed(() =>
    this.items().reduce((sum, i) => sum + i.price * i.qty, 0),
  );

  protected readonly nilaiPajak = computed(() =>
    Math.round((this.subtotal() * this.pajakPersen()) / 100),
  );

  protected readonly total = computed(() => this.subtotal() + this.nilaiPajak());

  protected readonly perOrang = computed(() =>
    this.jumlahOrang() > 0 ? Math.round(this.total() / this.jumlahOrang()) : 0,
  );

  protected readonly status = computed(() => {
    const p = this.perOrang();
    if (p < 30000) return { label: 'Hemat', cls: 'text-bg-success' };
    if (p <= 75000) return { label: 'Wajar', cls: 'text-bg-warning' };
    return { label: 'Mahal', cls: 'text-bg-danger' };
  });

  protected tambahItem() {
    const name = this.namaBaru().trim();
    const price = Number(this.hargaBaru());
    if (!name || !price || price <= 0) return;

    this.items.update((list) => [...list, { id: Date.now(), name, price, qty: 1 }]);
    this.namaBaru.set('');
    this.hargaBaru.set(null);
  }

  protected kosongkanDaftar() {
    this.items.set([]);
  }

  protected hapusItem(id: number) {
    this.items.update((list) => list.filter((i) => i.id !== id));
  }
}