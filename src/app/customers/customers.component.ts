import { Component, OnInit, ViewChild } from '@angular/core';
// jc
import { ActivatedRoute, Router } from '@angular/router';
import { ICustomer } from './shared/customer';
import { CustomerService } from './shared/customer.service';
import { IOrder } from '../orders/shared/order';
import { OrderService } from '../orders/shared/order.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  orders: IOrder[] = [];

  selectedRowIndex = -1;

  // MatPaginator Inputs
  // length = 100;
  pageSize = 5;
  pageSizeOptions = [5, 10, 25, 100];

  isTableHasData = true;

  displayedColumns: string[] = [
    'id',
    'firstName',
    'lastName',
    'viewOrders',
    'action'
  ];

  versions = [
    { id: '', 'name': 'All results' },
    { id: '2', 'name': 'Show results cont. "2"' },
    { id: '3', name: 'Filter results cont. "3"' },
  ];
  selectedVersion = this.versions[0].id;

  isLoadingResults = true;

  dataSource = new MatTableDataSource<ICustomer>();

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    private service: CustomerService,
    private orderService: OrderService,
    private route: ActivatedRoute ) { }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');

    this.loadData();

    // jc
    this.orderService.getOrdersByCustomer(id)
      .subscribe((orders: IOrder[]) => {
        this.orders = orders;
      });

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.paginator._intl.itemsPerPageLabel = 'Results per page:';
    // hide Next and Previous page tooltips
    const paginatorIntl = this.paginator._intl;
    paginatorIntl.nextPageLabel = '';
    paginatorIntl.previousPageLabel = '';
  }

  // or refresh()
  loadData() {
    this.service.getCustomers()
    .subscribe((res: ICustomer[]) => {
      this.dataSource.data = res;
      console.log(this.dataSource);
      this.isLoadingResults = false;
    }, err => {
      console.log(err);
      this.isLoadingResults = false;
    });
  }


  // filtering data
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim()
    .toLowerCase();
    this.dataSource.filter = filterValue;
    // no results
    if (this.dataSource.filteredData.length > 0) {
      this.isTableHasData = true;
    } else {
      this.isTableHasData = false;
    }
  }

  // highlight row
  highlight(row) {
    this.selectedRowIndex = row.id;
  }

}

